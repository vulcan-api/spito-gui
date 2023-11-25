import { UserInfo } from "./interfaces";
import { backendRequest } from "./request";

export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo === null) {
    return null;
  }
  return JSON.parse(userInfo);
};

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<number> => {
  const response = await backendRequest("auth/register", "POST", {
    username,
    email,
    password
  });
  return response.status;
};

export const login = async (email: string, password: string): Promise<number> => {
  const response = await backendRequest("auth/login", "POST", {
    email,
    password
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
  return response.status;
};

export const logout = (): void => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
};
