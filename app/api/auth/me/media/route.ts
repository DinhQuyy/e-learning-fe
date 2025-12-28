import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

function getAccessToken(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieParts = cookieHeader.split("; ");
  return (
    cookieParts.find((c) => c.startsWith("directus_access_token="))?.split("=")[1] ||
    cookieParts.find((c) => c.startsWith("access_token="))?.split("=")[1]
  );
}

const allowedFields = new Set(["avatar", "cover"]);

export async function POST(req: Request) {
  const token = getAccessToken(req);

  if (!token) {
    return NextResponse.json({ message: "Missing access token." }, { status: 401 });
  }

  if (!DIRECTUS_URL) {
    return NextResponse.json(
      { message: "Directus URL not configured." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const field = searchParams.get("field") || "";

  if (!allowedFields.has(field)) {
    return NextResponse.json({ message: "Unsupported field." }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  }

  const uploadBody = new FormData();
  uploadBody.append("file", file);

  const uploadRes = await fetch(`${DIRECTUS_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: uploadBody,
  });

  const uploadJson = await uploadRes.json().catch(() => null);

  if (!uploadRes.ok) {
    return NextResponse.json(
      {
        message:
          uploadJson?.errors?.[0]?.message ||
          uploadJson?.message ||
          "Upload failed.",
      },
      { status: uploadRes.status }
    );
  }

  const fileId = uploadJson?.data?.id;

  if (!fileId) {
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }

  const userRes = await fetch(`${DIRECTUS_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ [field]: fileId }),
  });

  const userJson = await userRes.json().catch(() => null);

  if (!userRes.ok) {
    return NextResponse.json(
      {
        message:
          userJson?.errors?.[0]?.message ||
          userJson?.message ||
          "Update failed.",
      },
      { status: userRes.status }
    );
  }

  return NextResponse.json({
    user: userJson?.data ?? userJson,
    file: uploadJson?.data ?? null,
  });
}
