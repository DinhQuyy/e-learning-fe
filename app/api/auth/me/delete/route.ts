import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

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

export async function DELETE(req: Request) {
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
    current_password?: string;
  };
  const currentPassword = String(payload.current_password || "");

  if (!currentPassword) {
    const response = NextResponse.json(
      { message: "Vui lòng nhập mật khẩu hiện tại." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  let userRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email`, {
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
      userRes = await fetch(`${DIRECTUS_URL}/users/me?fields=id,email`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userJson = await userRes.json().catch(() => null);
    }
  }

  if (!userRes.ok) {
    const response = NextResponse.json(
      { message: userJson?.message || "Không thể xác thực tài khoản." },
      { status: userRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const email = userJson?.data?.email;
  const userId = userJson?.data?.id;

  if (!email || !userId) {
    const response = NextResponse.json(
      { message: "Không tìm thấy thông tin tài khoản." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const verifyRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: currentPassword }),
  });

  if (!verifyRes.ok) {
    const response = NextResponse.json(
      { message: "Mật khẩu hiện tại không đúng." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  let deleteRes = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!deleteRes.ok && deleteRes.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      deleteRes = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  if (!deleteRes.ok && deleteRes.status === 403 && ADMIN_TOKEN) {
    const adminRes = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });
    const adminJson = await adminRes.json().catch(() => null);

    if (adminRes.ok) {
      const response = NextResponse.json({ message: "Tài khoản đã được xóa." });
      applyAuthCookies(response, refreshResult);
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

    const response = NextResponse.json(
      {
        message:
          adminJson?.errors?.[0]?.message ||
          adminJson?.message ||
          "Xóa tài khoản thất bại.",
      },
      { status: adminRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  if (!deleteRes.ok) {
    const deleteJson = await deleteRes.json().catch(() => null);
    const response = NextResponse.json(
      {
        message:
          deleteJson?.errors?.[0]?.message ||
          deleteJson?.message ||
          "Xóa tài khoản thất bại.",
      },
      { status: deleteRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const response = NextResponse.json({ message: "Tài khoản đã được xóa." });
  applyAuthCookies(response, refreshResult);
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
