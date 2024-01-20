import { backendRequest } from "./request";
import { backendResponse, rule, searchBackend as searchBackendInterface } from "./interfaces";

export const searchBackend = async (query: string): Promise<backendResponse<searchBackendInterface>> => {
  const response = await backendRequest(`search?query=${query}`, "GET");
  return {
    status: response.status,
    data: await response.json(),
  }
};

export const searchBackendForRules = async (query: string): Promise<backendResponse<rule[]>> => {
  const response = await backendRequest(`rule/search?search=${query}`, "GET");
  return {
    status: response.status,
    data: await response.json(),
  }
}