import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const me = await login(email.trim(), password);
      toast.success("Logged in");

      if (me.role === "Admin") {
        navigate("/admin/products", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="max-w-md mx-auto p-6">
        <div className="card-admin p-6">
          <h1 className="text-2xl font-bold text-foreground">Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Login to place orders and manage your account.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                className="input-admin mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-2">
                <Input
                  className="input-admin pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
