export type UserRole = "Admin" | "User";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  expiresInMinutes: number;
  user: AuthUser;
}
