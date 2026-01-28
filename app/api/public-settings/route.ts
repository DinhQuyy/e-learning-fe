import { NextResponse } from 'next/server';
import {
  defaultPublicSettings,
  normalizePublicSettings,
  PublicSettings,
} from '@/lib/public-settings';
import { directusRequest } from '@/lib/directus';

const COLLECTION = 'public_settings';
const SETTINGS_KEY = 'landing';

type DirectusSettingsItem = {
  id: number | string;
  key?: string;
  settings?: PublicSettings | Partial<PublicSettings> | null;
};

const fetchSettingsItem = async () => {
  const query = `/items/${COLLECTION}?filter[key][_eq]=${encodeURIComponent(
    SETTINGS_KEY
  )}&limit=1`;
  const res = await directusRequest<{ data: DirectusSettingsItem[] }>(query);
  return res?.data?.[0] ?? null;
};

export async function GET() {
  try {
    const item = await fetchSettingsItem();
    const settings = normalizePublicSettings(item?.settings ?? defaultPublicSettings);
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ settings: defaultPublicSettings });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const settings = normalizePublicSettings(body?.settings ?? body);
    const item = await fetchSettingsItem();
    const payload = { key: SETTINGS_KEY, settings };

    if (item?.id) {
      await directusRequest(`/items/${COLLECTION}/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    } else {
      await directusRequest(`/items/${COLLECTION}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to save public settings.' },
      { status: 500 }
    );
  }
}
