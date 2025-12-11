// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

async function directusRequest(
  method: 'PATCH' | 'DELETE',
  path: string,
  body?: any,
) {
  if (!DIRECTUS_URL || !ADMIN_TOKEN) {
    throw new Error('Thiếu DIRECTUS_URL hoặc DIRECTUS_ADMIN_TOKEN');
  }

  const res = await fetch(`${DIRECTUS_URL}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined,
  });

  // DELETE có thể trả về body rỗng → res.json() sẽ lỗi, nên phải catch
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    console.error('Directus error:', path, json);
    throw new Error(
      json?.errors?.[0]?.message ||
        `Directus ${method} request failed: ${path}`,
    );
  }

  // Với DELETE thì json thường là null → trả luôn json (null) cũng được
  return (json as any)?.data ?? json;
}


// ================== PATCH (UPDATE USER) ==================
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params; // Next 16: params là Promise
    const payload = (await req.json().catch(() => ({}))) as {
      name?: string;
      email?: string;
      role?: string;   // app_role trong Directus
      status?: string;
    };

    const body: any = {
      first_name: payload.name,     // lưu full name vào first_name
      email: payload.email,
      status: payload.status,
    };

    // Nếu bạn có field app_role kiểu string/enum → lưu vai trò FE ở đó
    if (payload.role) {
      body.app_role = payload.role; // ⚠️ KHÔNG gửi field "role"
    }

    // xóa key undefined cho sạch
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key],
    );

    const updated = await directusRequest('PATCH', `users/${id}`, body);

    const user = {
      id: updated.id,
      name: `${updated.first_name ?? ''} ${updated.last_name ?? ''}`.trim(),
      email: updated.email,
      role: updated.app_role ?? 'student',
      status: updated.status,
      joinedAt: updated.created_on || updated.date_created || null,
    };

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error('PATCH /api/admin/users/[id] error:', err);
    return NextResponse.json(
      { message: err?.message || 'Không cập nhật được người dùng' },
      { status: 500 },
    );
  }
}

// ================== DELETE giữ nguyên như trước ==================
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;

    await directusRequest('DELETE', `users/${id}`);

    // FE đang expect { success: true }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/admin/users/[id] error:', err);
    return NextResponse.json(
      { message: err?.message || 'Không xoá được người dùng' },
      { status: 500 },
    );
  }
}
