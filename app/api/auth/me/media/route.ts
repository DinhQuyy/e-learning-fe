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

const allowedFields = new Set(["avatar", "cover"]);

export async function POST(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const field = searchParams.get("field") || "";

  if (!allowedFields.has(field)) {
    const response = NextResponse.json(
      { message: "Unsupported field." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    const response = NextResponse.json(
      { message: "No file uploaded." },
      { status: 400 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const uploadBody = new FormData();
  uploadBody.append("file", file);

  let uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadBody,
  });

  let uploadJson = await uploadRes.json().catch(() => null);

  if (!uploadRes.ok && uploadRes.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadBody,
      });
      uploadJson = await uploadRes.json().catch(() => null);
    }
  }

  if (!uploadRes.ok) {
    const response = NextResponse.json(
      {
        message:
          uploadJson?.errors?.[0]?.message ||
          uploadJson?.message ||
          "Upload failed.",
      },
      { status: uploadRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const fileId = uploadJson?.data?.id;

  if (!fileId) {
    const response = NextResponse.json(
      { message: "Upload failed." },
      { status: 500 }
    );
    return applyAuthCookies(response, refreshResult);
  }

  let userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ [field]: fileId }),
  });

  let userJson = await userRes.json().catch(() => null);

  if (!userRes.ok && userRes.status === 401) {
    const retryRefresh = await refreshAccessToken(req);
    if (retryRefresh?.accessToken) {
      refreshResult = retryRefresh;
      token = retryRefresh.accessToken;
      userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: fileId }),
      });
      userJson = await userRes.json().catch(() => null);
    }
  }

  if (!userRes.ok) {
    const response = NextResponse.json(
      {
        message:
          userJson?.errors?.[0]?.message ||
          userJson?.message ||
          "Update failed.",
      },
      { status: userRes.status }
    );
    return applyAuthCookies(response, refreshResult);
  }

  const response = NextResponse.json({
    user: userJson?.data ?? userJson,
    file: uploadJson?.data ?? null,
  });
  return applyAuthCookies(response, refreshResult);
}
