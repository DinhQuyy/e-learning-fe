import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

type RefreshResult = {
  accessToken: string;
  refreshToken?: string;
  expires?: number;
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

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("directus_access_token", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set("directus_refresh_token", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

function splitFullName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first_name: "", last_name: "" };
  const first_name = parts.shift() || "";
  const last_name = parts.join(" ");
  return { first_name, last_name };
}

export async function GET(req: Request) {
  let token = getAccessToken(req);
  let refreshResult: RefreshResult | null = null;

  if (!token) {
    refreshResult = await refreshAccessToken(req);
    token = refreshResult?.accessToken || "";
  }

  if (!token) {
    console.warn("auth/me: missing access token cookie");
    const response = NextResponse.json(
      { user: null, message: "Token expired." },
      { status: 401 }
    );
    clearAuthCookies(response);
    return applyAuthCookies(response, refreshResult);
  }

  const baseFields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "avatar",
    "cover",
    "location",
    "description",
  ];
  const fields = baseFields.join(",");
  console.debug("auth/me: request fields", fields);
  console.debug(
    "auth/me: directus url",
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "(missing)"
  );
  const fetchUser = async (fields: string | null, accessToken: string) => {
    const query = fields ? `?fields=${encodeURIComponent(fields)}` : "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me${query}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const json = await response.json().catch(() => null);
    return { response, json };
  };

  const tryFetchUser = async (fields: string | null) => {
    let nextToken = token;
    let nextRefresh = refreshResult;
    let result = await fetchUser(fields, nextToken);

    if (!result.response.ok && result.response.status === 401) {
      const retryRefresh = await refreshAccessToken(req);
      if (retryRefresh?.accessToken) {
        nextRefresh = retryRefresh;
        nextToken = retryRefresh.accessToken;
        result = await fetchUser(fields, nextToken);
      }
    }

    return {
      response: result.response,
      json: result.json,
      token: nextToken,
      refreshResult: nextRefresh,
    };
  };

  const firstAttempt = await tryFetchUser(fields);
  let res = firstAttempt.response;
  let data = firstAttempt.json;
  token = firstAttempt.token;
  refreshResult = firstAttempt.refreshResult;

  if (!res.ok && res.status !== 401) {
    console.warn("auth/me: retry without fields", {
      status: res.status,
      errors: data?.errors,
      message: data?.message,
    });
    const fallback = await tryFetchUser(null);
    res = fallback.response;
    data = fallback.json;
    token = fallback.token;
    refreshResult = fallback.refreshResult;
  }

  if (!res.ok) {
    console.warn("auth/me: directus error", {
      status: res.status,
      errors: data?.errors,
      message: data?.message,
    });
    const response = NextResponse.json(
      {
        user: null,
        message:
          data?.errors?.[0]?.message ||
          data?.message ||
          "Unable to load profile.",
      },
      { status: res.status || 401 }
    );
    if (res.status === 401) {
      clearAuthCookies(response);
    }
    return applyAuthCookies(response, refreshResult);
  }

  console.debug("auth/me: directus response keys", Object.keys(data?.data || {}));
  const rawUser = data?.data ?? null;

  let userPayload = rawUser;

  if (rawUser && typeof rawUser === "object") {
    const firstName =
      typeof (rawUser as any).first_name === "string"
        ? (rawUser as any).first_name.trim()
        : "";
    const lastName =
      typeof (rawUser as any).last_name === "string"
        ? (rawUser as any).last_name.trim()
        : "";
    const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim();
    const existingDisplay =
      typeof (rawUser as any).display_name === "string"
        ? (rawUser as any).display_name.trim()
        : "";
    const fallbackName =
      typeof (rawUser as any).name === "string"
        ? (rawUser as any).name.trim()
        : "";
    const email =
      typeof (rawUser as any).email === "string"
        ? (rawUser as any).email.trim()
        : "";
    const emailLocal = email ? email.split("@")[0] || email : "";
    const displayName =
      combinedName || existingDisplay || fallbackName || emailLocal || email;
    const canBackfillName =
      !combinedName && (existingDisplay || fallbackName);

    userPayload = {
      ...(rawUser as any),
      display_name: displayName || existingDisplay || null,
      ...(canBackfillName
        ? {
            first_name: existingDisplay || fallbackName,
            last_name: "",
          }
        : {}),
    };
  }

  const response = NextResponse.json({ user: userPayload });
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
    console.warn("auth/me: missing access token cookie");
    const response = NextResponse.json({ user: null }, { status: 401 });
    return applyAuthCookies(response, refreshResult);
  }

  const payload = (await req.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    location?: string;
    bio?: string;
  };

  const body: Record<string, string> = {};

  if (payload.name !== undefined) {
    const { first_name, last_name } = splitFullName(String(payload.name));
    body.first_name = first_name;
    body.last_name = last_name;
  }

  if (payload.email !== undefined) {
    body.email = String(payload.email);
  }

  if (payload.location !== undefined) {
    body.location = String(payload.location);
  }

  if (payload.bio !== undefined) {
    body.description = String(payload.bio);
  }

  if (!Object.keys(body).length) {
    const response = NextResponse.json(
      { message: "No profile fields provided." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  let res = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  let data = await res.json().catch(() => null);

  if (!res.ok && res.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      res = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      data = await res.json().catch(() => null);
    }
  }

  if (!res.ok) {
    console.warn("auth/me: directus update error", {
      status: res.status,
      errors: data?.errors,
      message: data?.message,
    });
    const response = NextResponse.json(
      { message: data?.errors?.[0]?.message || data?.message || "Update failed." },
      { status: res.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const response = NextResponse.json({ user: data?.data ?? data });
  return applyAuthCookies(response, refreshResult);
}
