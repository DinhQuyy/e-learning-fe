// lib/directus.ts
const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

// Nếu bạn có token admin/service account thì dùng server-side cho CRUD khỏi dính permission
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN; // KHÔNG dùng NEXT_PUBLIC

export async function directusRequest<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${DIRECTUS_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as any),
  };

  if (DIRECTUS_TOKEN) {
    headers.Authorization = `Bearer ${DIRECTUS_TOKEN}`;
  }

  const res = await fetch(url, { ...init, headers, cache: "no-store" });

  // DELETE/PATCH đôi khi trả rỗng -> đừng res.json() luôn
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      json?.errors?.[0]?.message || `Directus error (status ${res.status})`;
    throw new Error(message);
  }

  return json as T;
}
