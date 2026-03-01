import { Search, ShoppingCart, ReceiptText, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useCart } from "@/cart/CartContext";

type ShopHeaderProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
};

const ShopHeader = ({ search = "", onSearchChange }: ShopHeaderProps) => {
  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center rotate-180">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">E-Shop</span>
        </Link>

        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for products, categories..."
              className="pl-11 py-5 bg-muted/50 border-0 rounded-full"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user?.role === "Admin" ? (
            <Link to="/admin/products">
              <Button variant="outline" size="sm" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          ) : (
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </nav>
          )}

          {user?.role !== "Admin" ? (
            <div className="flex items-center gap-2">
              <Link to="/cart" aria-label="Cart">
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {totalQuantity > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] leading-5 text-center">
                      {totalQuantity}
                    </span>
                  ) : null}
                </Button>
              </Link>

              {user ? (
                <Link to="/orders" aria-label="Orders">
                  <Button variant="outline" size="icon">
                    <ReceiptText className="w-4 h-4" />
                  </Button>
                </Link>
              ) : null}
            </div>
          ) : null}

          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
              }}
            >
              Logout
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
