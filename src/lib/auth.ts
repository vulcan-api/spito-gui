import { UserInfo } from "./interfaces";
import { backendRequest } from "./request";

export const getUserInfo = (): UserInfo => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo === null) {
        return {
            id: 0,
            username: "",
        };
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
        password,
    });
    return response.status;
};

export const login = async (
    email: string,
    password: string
): Promise<number> => {
    const response = await backendRequest("auth/login", "POST", {
        email,
        password,
    });
    const data = await response.json();
    if (!data.is2FAEnabled) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
    } else {
        return 600;
    }
    return response.status;
};

export const verify2FA = async (
    email: string,
    code: string
): Promise<boolean> => {
    const response = await backendRequest("auth/totp/verify", "POST", {
        email,
        code,
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
    return response.ok;
};

export const logout = (): void => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
};

export const changePassword = async (
    currentPassword: string,
    newPassword: string
): Promise<number> => {
    const response = await backendRequest("auth/password/change", "PUT", {
        currentPassword,
        newPassword,
    });
    return response.status;
};
