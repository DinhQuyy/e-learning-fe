import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export async function POST(req: Request) {
  if (!DIRECTUS_URL) {
    return NextResponse.json(
      { message: "Directus URL not configured." },
      { status: 500 }
    );
  }

  if (!DIRECTUS_TOKEN) {
    return NextResponse.json(
      { message: "Directus token not configured." },
      { status: 500 }
    );
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
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
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

  return NextResponse.json({ file: uploadJson?.data ?? null }, { status: 200 });
}
