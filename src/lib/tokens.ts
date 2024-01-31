import { Token } from "./interfaces";
import { backendRequest } from "./request";

export const getUserTokens = async (): Promise<Token[]> => {
    const response = await backendRequest("token", "GET");
    return await response.json();
};

export const createToken = async (
    name: string,
    expiresAt?: Date
): Promise<{ token: string }> => {
    const response = await backendRequest("token", "POST", { name, expiresAt });
    return await response.json();
};

export const deleteToken = async (id: number): Promise<number> => {
    const response = await backendRequest(`token/${id}`, "DELETE");
    return response.status;
};
