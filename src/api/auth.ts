import { apiRequest, setAuthToken } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: LoginUser;
}

export async function login(payload: LoginPayload) {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });

  setAuthToken(data.token);

  return data;
}
