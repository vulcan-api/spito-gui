import { backendResponse, environment, newEnvironment } from "./interfaces";
import { backendRequest, backendRequestWithFiles } from "./request";

export const createEnvironment = async (data: newEnvironment): Promise<boolean> => {
  const response = await backendRequest("environment", "POST", data);
  return response.ok;
};

export const getUserEnvironments = async (
  userId: number
): Promise<backendResponse<Array<environment>>> => {
  const response = await backendRequest(`environment/user/${userId}`, "GET");
  return {
    status: response.status,
    data: await response.json()
  };
};

export const likeOrDislike = async (environmentId: number): Promise<boolean> => {
  const response = await backendRequest(`environment/${environmentId}/like`, "GET");
  return response.ok;
};

export const deleteEnvironment = async (environmentId: number): Promise<boolean> => {
  const response = await backendRequest(`environment/${environmentId}`, "DELETE");
  return response.ok;
};

export const updateEnvironment = async (
  environmentId: number,
  data: newEnvironment
): Promise<boolean> => {
  const response = await backendRequest(`environment/${environmentId}`, "PUT", data);
  return response.ok;
};

export const getEnvironmentById = async (
  environmentId: number
): Promise<backendResponse<environment>> => {
  const response = await backendRequest(`environment/${environmentId}`, "GET");
  return {
    status: response.status,
    data: await response.json()
  };
};

export const addRuleToEnv = async (
  environmentId: number,
  ruleId: number
): Promise<number> => {
  const response = await backendRequest(`environment/${environmentId}/rules/add`, "POST", {
    ruleId
  });
  return response.status;
};

export const deleteRuleFromEnv = async (
  environmentId: number,
  ruleId: number
): Promise<number> => {
  const response = await backendRequest(`environment/${environmentId}/rules/${ruleId}`, "DELETE");
  return response.status;
}

export const updateEnvironmentLogo = async (
  environmentId: number,
  data: FormData
): Promise<boolean> => {
  const response = await backendRequestWithFiles(
    `environment/${environmentId}/logo`,
    "PUT",
    data
  );
  return response.ok;
}

export const getEnvironmentLogo = async (
  environmentId: number
): Promise<Blob | null> => {
  const response = await backendRequest(`environment/${environmentId}/logo`, "GET");
  if (!response.ok || response.status === 204) return null;
  return await response.blob();
}