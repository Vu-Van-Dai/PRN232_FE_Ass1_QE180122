import { apiRequest } from "@/api/http";
import type { AuthResponse, AuthUser } from "@/types/auth";

export async function register(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function getMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/me");
}

export async function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/auth/logout", { method: "POST" });
}
