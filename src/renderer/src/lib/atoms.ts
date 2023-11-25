import { atom } from "jotai";
import { UserInfo } from "./interfaces";
import { getUserInfo } from "./auth";

const userAtom = atom<UserInfo | null, any[], unknown>(
  getUserInfo,
  (_get, set, newUserInfo: UserInfo | null) => {
    set(userAtom, newUserInfo);
  }
);

export { userAtom };