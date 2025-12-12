import { NextResponse } from "next/server";

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN; // hoặc DIRECTUS_TOKEN của bạn

async function directusFetch(path: string, init?: RequestInit) {
  const url = `${DIRECTUS_URL}/${path}`;

  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (res.status === 204) return { res, json: null as any };

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  return { res, json };
}

export async function GET() {
  try {
    // ⚠️ IMPORTANT:
    // Bên categories của bạn có thể không phải field "name".
    // Nếu bạn đang bị lỗi "name" -> đổi sang "title".
    const fields = ["id", "name"].join(",");

    const { res, json } = await directusFetch(
      `items/categories?limit=-1&fields=${fields}`
    );

    if (!res.ok) {
      const msg =
        json?.errors?.[0]?.message || "Không lấy được danh sách danh mục";
      return NextResponse.json({ message: msg }, { status: 500 });
    }

    return NextResponse.json({ categories: json?.data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Lỗi server khi lấy categories" },
      { status: 500 }
    );
  }
}
