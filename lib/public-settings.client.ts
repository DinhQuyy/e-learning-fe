'use client';

import { useEffect, useState } from 'react';
import {
  defaultPublicSettings,
  normalizePublicSettings,
  PublicSettings,
} from './public-settings';

export type { PublicSettings, PublicStat, PublicFeature } from './public-settings';

const STORAGE_KEY = 'elearning.public-settings';
const API_ENDPOINT = '/api/public-settings';

const updateLocalPublicSettings = (settings: PublicSettings) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    return;
  }

  window.dispatchEvent(new Event('public-settings-updated'));
};

export const loadPublicSettings = (): PublicSettings => {
  if (typeof window === 'undefined') {
    return defaultPublicSettings;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultPublicSettings;
    }
    const parsed = JSON.parse(raw);
    return normalizePublicSettings(parsed);
  } catch {
    return defaultPublicSettings;
  }
};

export const fetchPublicSettings = async (): Promise<PublicSettings> => {
  try {
    const res = await fetch(API_ENDPOINT, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch settings');
    }
    const data = await res.json().catch(() => null);
    const settings = normalizePublicSettings(data?.settings ?? data);
    updateLocalPublicSettings(settings);
    return settings;
  } catch {
    return loadPublicSettings();
  }
};

export const savePublicSettings = async (settings: PublicSettings) => {
  const normalized = normalizePublicSettings(settings);

  try {
    await fetch(API_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: normalized }),
    });
  } catch {
    // Keep local settings even if the API fails.
  }

  updateLocalPublicSettings(normalized);
};

export const subscribePublicSettings = (
  callback: (settings: PublicSettings) => void
) => {
  const handler = (event?: StorageEvent | Event) => {
    if (event && 'key' in event && event.key && event.key !== STORAGE_KEY) {
      return;
    }
    callback(loadPublicSettings());
  };

  window.addEventListener('storage', handler as EventListener);
  window.addEventListener('public-settings-updated', handler as EventListener);

  return () => {
    window.removeEventListener('storage', handler as EventListener);
    window.removeEventListener('public-settings-updated', handler as EventListener);
  };
};

export const usePublicSettings = () => {
  const [settings, setSettings] = useState<PublicSettings>(defaultPublicSettings);

  useEffect(() => {
    setSettings(loadPublicSettings());
    let isActive = true;

    fetchPublicSettings().then((next) => {
      if (isActive) {
        setSettings(next);
      }
    });

    const unsubscribe = subscribePublicSettings((next) => {
      if (isActive) {
        setSettings(next);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  return { settings, setSettings };
};

export { defaultPublicSettings };
