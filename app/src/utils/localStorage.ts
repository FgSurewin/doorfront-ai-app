export const ID = "id";
export const TOKEN = "token";
export const NICKNAME = "nickname";

export type LocalStorageKeyType = typeof ID | typeof TOKEN | typeof NICKNAME;

export const saveLocal = (key: LocalStorageKeyType, value: string) => {
  sessionStorage.setItem(key, value);
};
export const readLocal = (key: LocalStorageKeyType) => {
  return sessionStorage.getItem(key);
};
export const deleteLocal = (key: LocalStorageKeyType) => {
  sessionStorage.removeItem(key);
};

export const deleteAllLocal = () => {
  deleteLocal(ID);
  deleteLocal(TOKEN);
  deleteLocal(NICKNAME);
};

export const readAllLocal = () => ({
  id: readLocal(ID),
  token: readLocal(TOKEN),
  nickname: readLocal(NICKNAME),
});

export const saveAllLocal = (info: {
  id: string;
  token: string;
  nickname: string;
}) => {
  for (const [key, value] of Object.entries(info)) {
    saveLocal(key as LocalStorageKeyType, value);
  }
};
