import { backendRequest } from "./request";
import { backendResponse, searchBackend as searchBackendInterface } from "./interfaces";

export const searchBackend = async (query: string): Promise<backendResponse<searchBackendInterface>> => {
  const response = await backendRequest(`search?query=${query}`, "GET");
  return {
    status: response.status,
    data: await response.json(),
  }
};
