import {
    ProfileInterface,
    Settings,
    tagInterface,
    newRuleset,
    ruleset,
    rule,
    backendResponse,
    TwoFAQrCode,
    UserActivity,
} from "./interfaces";
import { backendRequest, backendRequestWithFiles } from "./request";

export const getUserAvatar = async (userId: number): Promise<Blob | null> => {
    const res = await backendRequest(`user/settings/avatar/${userId}`, "GET");
    if (!res.ok || res.status === 204) return null;
    return await res.blob();
};

export const getSettings = async (): Promise<Settings | null> => {
    const response = await backendRequest("user/settings", "GET");
    if (response.status === 200) {
        return await response.json();
    }
    return null;
};

export const updateSettings = async (data: Settings): Promise<boolean> => {
    const response = await backendRequest("user/settings", "PUT", data);
    return response.ok;
};

export const updateAvatar = async (data: FormData): Promise<boolean> => {
    const response = await backendRequestWithFiles(
        "user/settings/avatar",
        "PUT",
        data
    );
    return response.ok;
};

export const getUserProfile = async (
    userId: number
): Promise<backendResponse<ProfileInterface>> => {
    const response = await backendRequest(`user/${userId}`, "GET");
    return {
        status: response.status,
        data: await response.json(),
    };
};

export const getTagHints = async (
    query: string
): Promise<{ tags: Array<tagInterface> }> => {
    const response = await backendRequest(`tag?search=${query}`, "GET");
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
};

export const createRuleset = async (data: newRuleset): Promise<boolean> => {
    const response = await backendRequest("ruleset", "POST", data);
    return response.ok;
};

export const getRulesetById = async (rulesetId: number): Promise<ruleset> => {
    const response = await backendRequest(`ruleset/${rulesetId}`, "GET");
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
};

export const updateRuleset = async (
    data: newRuleset,
    rulesetId: number
): Promise<boolean> => {
    const response = await backendRequest(`ruleset/${rulesetId}`, "PUT", data);
    return response.ok;
};

export const fetchUserRulests = async (
    userId: number,
    skip = 0,
    take = 10
): Promise<{
    data: Array<ruleset>;
    count: number;
}> => {
    const response = await backendRequest(
        `ruleset/user/${userId}?skip=${skip}&take=${take}`,
        "GET"
    );
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
};

export const fetchUserRules = async (
    userId: number,
    skip: number,
    take: number
): Promise<Array<rule>> => {
    const response = await backendRequest(
        `rule/user/${userId}?skip=${skip}&take=${take}`,
        "GET"
    );
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
};

export const likeOrDislikeRule = async (ruleId: number): Promise<boolean> => {
    const response = await backendRequest(`rule/like/${ruleId}`, "GET");
    return response.ok;
};

export const fetchRuleset = async (rulesetId: number): Promise<ruleset> => {
    const response = await backendRequest(`ruleset/${rulesetId}`, "GET");
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
};

export const enableTwoFA = async (
    secret: string,
    code: string
): Promise<boolean> => {
    const response = await backendRequest("auth/totp/enable", "PATCH", {
        secret,
        code,
    });
    return response.ok;
};

export const getTwoFAStatus = async (): Promise<boolean> => {
    const response = await backendRequest("auth/totp/is-enabled", "GET");
    return (await response.json()).is2faEnabled;
};

export const getTwoFAQrCodeUrl = async (): Promise<
    backendResponse<TwoFAQrCode>
> => {
    const response = await backendRequest("auth/totp/code", "GET");
    return {
        status: response.status,
        data: await response.json(),
    };
};

export const disable2FA = async (): Promise<boolean> => {
    const response = await backendRequest("auth/totp/remove", "PATCH");
    return response.ok;
};

export const getUserActivity = async (
    userId: number,
    from: Date,
    to: Date
): Promise<UserActivity> => {
    const formattedFrom = from.toISOString().split("T")[0];
    const formattedTo = to.toISOString().split("T")[0];
    const response = await backendRequest(
        `user/activity/${userId}?from=${formattedFrom}&to=${formattedTo}`,
        "GET"
    );
    return await response.json();
};
