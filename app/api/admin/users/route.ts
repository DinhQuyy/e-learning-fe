// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const DEFAULT_ROLE_ID = process.env.DIRECTUS_DEFAULT_ROLE_ID;
const DEFAULT_USER_PASSWORD = '12345678'; // DEMO ONLY

async function directusRequest(path: string, init?: RequestInit) {
  if (!DIRECTUS_URL || !ADMIN_TOKEN) {
    throw new Error('Thiếu DIRECTUS_URL hoặc DIRECTUS_ADMIN_TOKEN');
  }

  const res = await fetch(`${DIRECTUS_URL}/${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    console.error('Directus error:', path, json);
    const msg =
      (json as any)?.errors?.[0]?.message ||
      (json as any)?.message ||
      `Directus request failed: ${path}`;
    throw new Error(msg);
  }

  return json;
}

// Chuẩn hoá role về 'admin' | 'instructor' | 'student' (còn lại coi như student)
function normalizeRole(raw: any): 'admin' | 'instructor' | 'student' {
  if (raw === 'admin' || raw === 'instructor' || raw === 'student') return raw;
  // nếu Directus trả uuid role thì mình default là student cho FE
  return 'student';
}

// Map Directus user -> user cho FE
function mapDirectusUserToAppUser(u: any) {
  const name =
    [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || '';

  return {
    id: u.id,
    name,
    email: u.email,
    role: normalizeRole(u.role),
    status: (u.status || 'active') as any,
    // Không xin created_at / date_created nữa để khỏi dính permission
    joinedAt: '', // nếu sau này mở permission thì mình map thêm cũng được
  };
}

/* ===== GET /api/admin/users ===== */
export async function GET() {
  try {
    // ⚠️ KHÔNG còn created_at, app_role nữa
    const fields = 'id,first_name,last_name,email,role,status';

    const json = await directusRequest(
      `users?limit=-1&fields=${encodeURIComponent(fields)}`
    );
    const data = (json as any).data ?? json;

    const users = Array.isArray(data)
      ? data.map((u) => mapDirectusUserToAppUser(u))
      : [];

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('GET /api/admin/users error:', err);
    return NextResponse.json(
      {
        message:
          err?.message ||
          'Không lấy được danh sách người dùng (users API lỗi)',
      },
      { status: 500 }
    );
  }
}

/* ===== POST /api/admin/users ===== */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, status } = body as {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    };

    if (!email || !name) {
      return NextResponse.json(
        { message: 'Thiếu name hoặc email' },
        { status: 400 }
      );
    }

    const parts = String(name).trim().split(/\s+/);
    const first_name = parts.shift() || '';
    const last_name = parts.join(' ');

    const payload: any = {
      email,
      first_name,
      last_name,
      status: status || 'active',
      password: DEFAULT_USER_PASSWORD,
    };

    // gán role Directus mặc định nếu có env
    if (DEFAULT_ROLE_ID) {
      payload.role = DEFAULT_ROLE_ID;
    }

    // Lúc này KHÔNG gửi app_role nữa

    const json = await directusRequest('users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const created = (json as any).data ?? json;
    const user = mapDirectusUserToAppUser(created);

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/users error:', err);
    return NextResponse.json(
      { message: err?.message || 'Không tạo được người dùng' },
      { status: 500 }
    );
  }
}
