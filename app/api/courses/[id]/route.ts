import { NextResponse } from "next/server";

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

const DIRECTUS_TOKEN =  process.env.DIRECTUS_ADMIN_TOKEN;

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

// ✅ Next 15: params là Promise -> phải await
type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/courses/:id
export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params; // ✅ FIX HERE
    const body = await req.json();

    const payload = {
      title: body.title,
      slug: body.slug,
      description: body.description,
      price: body.price,
      level: body.level,
      thumbnail: body.thumbnail,
      category: body.category ? Number(body.category) : null,
      status: body.status,
    };

    const { res, json } = await directusFetch(`items/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = json?.errors?.[0]?.message || "Không cập nhật được khoá học";
      return NextResponse.json({ message: msg }, { status: 500 });
    }

    return NextResponse.json({ course: json?.data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Lỗi server khi cập nhật khoá học" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/:id
export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params; // ✅ FIX HERE

    const { res, json } = await directusFetch(`items/courses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const msg = json?.errors?.[0]?.message || "Không xoá được khoá học";
      return NextResponse.json({ message: msg }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Lỗi server khi xoá khoá học" },
      { status: 500 }
    );
  }
}
