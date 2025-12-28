import { NextResponse } from "next/server";

function getAccessToken(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieParts = cookieHeader.split("; ");
  return (
    cookieParts.find((c) => c.startsWith("directus_access_token="))?.split("=")[1] ||
    cookieParts.find((c) => c.startsWith("access_token="))?.split("=")[1]
  );
}

function splitFullName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first_name: "", last_name: "" };
  const first_name = parts.shift() || "";
  const last_name = parts.join(" ");
  return { first_name, last_name };
}

export async function GET(req: Request) {
  const token = getAccessToken(req);

  if (!token) {
    console.warn("auth/me: missing access token cookie");
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const fields = [
    "id",
    "first_name",
    "last_name",
    "email",
    "avatar",
    "cover",
    "location",
    "description",
  ].join(",");
  console.debug("auth/me: request fields", fields);
  console.debug(
    "auth/me: directus url",
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "(missing)"
  );
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me?fields=${encodeURIComponent(
      fields
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.warn("auth/me: directus error", {
      status: res.status,
      errors: data?.errors,
      message: data?.message,
    });
    return NextResponse.json({ user: null }, { status: 401 });
  }

  console.debug("auth/me: directus response keys", Object.keys(data?.data || {}));
  return NextResponse.json({ user: data.data });
}

export async function PATCH(req: Request) {
  const token = getAccessToken(req);

  if (!token) {
    console.warn("auth/me: missing access token cookie");
    return NextResponse.json({ user: null }, { status: 401 });
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
    return NextResponse.json(
      { message: "No profile fields provided." },
      { status: 400 }
    );
  }

  const res = await fetch(
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

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.warn("auth/me: directus update error", {
      status: res.status,
      errors: data?.errors,
      message: data?.message,
    });
    return NextResponse.json(
      { message: data?.errors?.[0]?.message || data?.message || "Update failed." },
      { status: res.status }
    );
  }

  return NextResponse.json({ user: data?.data ?? data });
}
