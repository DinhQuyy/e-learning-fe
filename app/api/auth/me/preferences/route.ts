import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
  expires?: number;
};

type NotificationSettings = {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  marketing: boolean;
};

type PrivacySettings = {
  profileVisibility: "public" | "students" | "private";
  showEmail: boolean;
  showLocation: boolean;
  showCertificates: boolean;
};

type AppSettings = {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
};

const defaultAppSettings: AppSettings = {
  notifications: {
    email: true,
    push: true,
    courseUpdates: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: "students",
    showEmail: false,
    showLocation: true,
    showCertificates: true,
  },
};

const buildSettingsFromPreferences = (
  rawPreferences: unknown,
  overrides?: Partial<AppSettings>
): AppSettings => {
  const basePreferences =
    rawPreferences && typeof rawPreferences === "object" ? rawPreferences : {};
  const currentSettings = (basePreferences as { app_settings?: Partial<AppSettings> })
    .app_settings ?? {};

  return {
    notifications: {
      ...defaultAppSettings.notifications,
      ...(currentSettings.notifications ?? {}),
      ...(overrides?.notifications ?? {}),
    },
    privacy: {
      ...defaultAppSettings.privacy,
      ...(currentSettings.privacy ?? {}),
      ...(overrides?.privacy ?? {}),
    },
  };
};

function getCookieValue(req: Request, name: string) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieParts = cookieHeader.split("; ");
  return cookieParts.find((c) => c.startsWith(`${name}=`))?.split("=")[1];
}

function getAccessToken(req: Request) {
  return (
    getCookieValue(req, "directus_access_token") ||
    getCookieValue(req, "access_token")
  );
}

function getRefreshToken(req: Request) {
  return (
    getCookieValue(req, "directus_refresh_token") ||
    getCookieValue(req, "refresh_token")
  );
}

async function refreshAccessToken(req: Request): Promise<RefreshResult | null> {
  const refreshToken = getRefreshToken(req);
  if (!DIRECTUS_URL || !refreshToken) return null;

  const res = await fetch(`${DIRECTUS_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.warn("auth/refresh: directus error", {
      status: res.status,
      errors: data?.errors,
      message: data?.message,
    });
    return null;
  }

  const accessToken = data?.data?.access_token;
  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: data?.data?.refresh_token ?? refreshToken,
    expires: data?.data?.expires,
  };
}

function applyAuthCookies(
  response: NextResponse,
  refreshResult?: RefreshResult | null
) {
  if (!refreshResult?.accessToken) return response;
  const accessCookie: {
    httpOnly: true;
    sameSite: "lax";
    path: string;
    maxAge?: number;
  } = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  };
  if (refreshResult.expires) {
    accessCookie.maxAge = refreshResult.expires;
  }
  response.cookies.set("directus_access_token", refreshResult.accessToken, accessCookie);
  if (refreshResult.refreshToken) {
    response.cookies.set("directus_refresh_token", refreshResult.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return response;
}

export async function GET(req: Request) {
  let token = getAccessToken(req);
  let refreshResult: RefreshResult | null = null;

  if (!token) {
    refreshResult = await refreshAccessToken(req);
    token = refreshResult?.accessToken || "";
  }

  if (!token) {
    const response = NextResponse.json(
      { message: "Missing access token." },
      { status: 401 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  if (!DIRECTUS_URL) {
    const response = NextResponse.json(
      { message: "Directus URL not configured." },
      { status: 500 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const fetchWithToken = async (path: string, accessToken: string) => {
    const response = await fetch(`${DIRECTUS_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json().catch(() => null);
    return { response, json };
  };

  let { response: prefsRes, json: prefsJson } = await fetchWithToken(
    "/users/me?fields=preferences",
    token
  );

  if (!prefsRes.ok && prefsRes.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      const retry = await fetchWithToken("/users/me?fields=preferences", token);
      prefsRes = retry.response;
      prefsJson = retry.json;
    }
  }

  let rawPreferences = prefsJson?.data?.preferences;

  if ((!prefsRes.ok || !rawPreferences) && ADMIN_TOKEN) {
    const idResult = await fetchWithToken("/users/me?fields=id", token);
    const userId = idResult.json?.data?.id;
    if (idResult.response.ok && userId) {
      const adminRes = await fetch(
        `${DIRECTUS_URL}/users/${userId}?fields=preferences`,
        {
          headers: {
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );
      const adminJson = await adminRes.json().catch(() => null);
      if (adminRes.ok) {
        rawPreferences = adminJson?.data?.preferences;
      }
    }
  }

  if (!prefsRes.ok && !rawPreferences) {
    const response = NextResponse.json(
      { message: prefsJson?.message || "Không thể lấy cài đặt." },
      { status: prefsRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const settings = buildSettingsFromPreferences(rawPreferences);
  const response = NextResponse.json({ settings });
  return applyAuthCookies(response, refreshResult);
}

export async function PATCH(req: Request) {
  let token = getAccessToken(req);
  let refreshResult: RefreshResult | null = null;

  if (!token) {
    refreshResult = await refreshAccessToken(req);
    token = refreshResult?.accessToken || "";
  }

  if (!token) {
    const response = NextResponse.json(
      { message: "Missing access token." },
      { status: 401 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  if (!DIRECTUS_URL) {
    const response = NextResponse.json(
      { message: "Directus URL not configured." },
      { status: 500 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const payload = (await req.json().catch(() => ({}))) as {
    notifications?: Partial<NotificationSettings>;
    privacy?: Partial<PrivacySettings>;
  };

  if (!payload.notifications && !payload.privacy) {
    const response = NextResponse.json(
      { message: "No settings provided." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  let userRes = await fetch(`${DIRECTUS_URL}/users/me?fields=preferences`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let userJson = await userRes.json().catch(() => null);

  if (!userRes.ok && userRes.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      userRes = await fetch(`${DIRECTUS_URL}/users/me?fields=preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userJson = await userRes.json().catch(() => null);
    }
  }

  if (!userRes.ok) {
    const response = NextResponse.json(
      { message: userJson?.message || "Không thể tải cài đặt hiện tại." },
      { status: userRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const rawPreferences = userJson?.data?.preferences;
  const basePreferences =
    rawPreferences && typeof rawPreferences === "object" ? rawPreferences : {};
  const nextSettings = buildSettingsFromPreferences(rawPreferences, {
    notifications: payload.notifications,
    privacy: payload.privacy,
  });

  const nextPreferences = {
    ...basePreferences,
    app_settings: nextSettings,
  };

  let updateRes = await fetch(`${DIRECTUS_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferences: nextPreferences }),
  });
  let updateJson = await updateRes.json().catch(() => null);

  if (!updateRes.ok && updateRes.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      updateRes = await fetch(`${DIRECTUS_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences: nextPreferences }),
      });
      updateJson = await updateRes.json().catch(() => null);
    }
  }

  if (!updateRes.ok && updateRes.status === 403 && ADMIN_TOKEN) {
    const idResult = await fetch(`${DIRECTUS_URL}/users/me?fields=id`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const idJson = await idResult.json().catch(() => null);
    const userId = idJson?.data?.id;

    if (idResult.ok && userId) {
      const adminRes = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ preferences: nextPreferences }),
      });
      const adminJson = await adminRes.json().catch(() => null);

      if (adminRes.ok) {
        const response = NextResponse.json({ settings: nextSettings });
        return applyAuthCookies(response, refreshResult);
      }

      const response = NextResponse.json(
        {
          message:
            adminJson?.errors?.[0]?.message ||
            adminJson?.message ||
            "Cập nhật cài đặt thất bại.",
        },
        { status: adminRes.status }
      );
      return applyAuthCookies(response, refreshResult);
    }
  }

  if (!updateRes.ok) {
    const response = NextResponse.json(
      {
        message:
          updateJson?.errors?.[0]?.message ||
          updateJson?.message ||
          "Cập nhật cài đặt thất bại.",
      },
      { status: updateRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const response = NextResponse.json({
    settings: nextSettings,
  });
  return applyAuthCookies(response, refreshResult);
}
