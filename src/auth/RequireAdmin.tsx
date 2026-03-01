import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
