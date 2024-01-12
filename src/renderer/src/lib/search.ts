import { backendRequest } from "./request";
import { searchBackend as searchBackendInterface } from "./interfaces";

export const searchBackend = async (query: string): Promise<searchBackendInterface> => {
  const response = await backendRequest(`search?query=${query}`, "GET");
  if (response.status === 200) {
    return response.json();
  }
  throw new Error("Failed to search");
};
