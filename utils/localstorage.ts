export const enum LocalStorageKeys {
  AUTH = "auth",
  CART = "cart",
}

export function updateStoreItem<T>(key: LocalStorageKeys, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function retrieveStoreItem<T>(key: LocalStorageKeys): T | null {
  const data = localStorage.getItem(key);

  if (!!data) return JSON.parse(data);

  return null;
}
