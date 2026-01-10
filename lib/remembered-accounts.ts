export type RememberedAccount = {
  email: string;
  password: string;
};

const STORAGE_KEY = "remembered_accounts";

const isBrowser = () => typeof window !== "undefined";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const getRememberedAccounts = (): RememberedAccount[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item) => item && typeof item.email === "string")
      .map((item) => ({
        email: String(item.email),
        password: String(item.password ?? ""),
      }))
      .filter((item) => item.email);
  } catch {
    return [];
  }
};

export const saveRememberedAccounts = (accounts: RememberedAccount[]) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

export const upsertRememberedAccount = (account: RememberedAccount) => {
  const normalizedEmail = normalizeEmail(account.email);
  if (!normalizedEmail) {
    return;
  }
  const existing = getRememberedAccounts();
  const next = [
    { email: account.email, password: account.password },
    ...existing.filter(
      (item) => normalizeEmail(item.email) !== normalizedEmail
    ),
  ];
  saveRememberedAccounts(next);
};

export const removeRememberedAccount = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return;
  }
  const existing = getRememberedAccounts();
  const next = existing.filter(
    (item) => normalizeEmail(item.email) !== normalizedEmail
  );
  saveRememberedAccounts(next);
};

export const findRememberedAccount = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return undefined;
  }
  return getRememberedAccounts().find(
    (item) => normalizeEmail(item.email) === normalizedEmail
  );
};
