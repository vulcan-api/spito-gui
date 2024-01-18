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
