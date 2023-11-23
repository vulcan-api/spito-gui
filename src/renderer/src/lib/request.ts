import { BACKEND_ORIGIN } from "./constants";

export const backendRequest = (path: string, method: string, body?: unknown): Promise<Response> => {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return fetch(`${BACKEND_ORIGIN}/${path}`, {
    method: method,
    headers: headers,
    redirect: "follow",
    body: JSON.stringify(body)
  });
};
