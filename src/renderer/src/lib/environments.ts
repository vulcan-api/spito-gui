import { backendResponse, environment, newEnvironment } from "./interfaces";
import { backendRequest } from "./request";

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
}

export const updateEnvironment = async (environmentId: number, data: newEnvironment): Promise<boolean> => {
  const response = await backendRequest(`environment/${environmentId}`, "PUT", data);
  return response.ok;
}

export const getEnvironmentById = async (environmentId: number): Promise<backendResponse<environment>> => {
  const response = await backendRequest(`environment/${environmentId}`, "GET");
  return {
    status: response.status,
    data: await response.json()
  };
}