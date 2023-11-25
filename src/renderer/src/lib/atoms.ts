import { atom } from "jotai";
import { UserInfo } from "./interfaces";
import { getUserInfo } from "./auth";

const userAtom = atom<UserInfo | null>(getUserInfo());

export { userAtom };
