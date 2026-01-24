import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/admin/products" },
  { label: "Category", path: "/admin/categories" },
];

interface AdminHeaderProps {
  showSearch?: boolean;
}

const AdminHeader = ({ showSearch = false }: AdminHeaderProps) => {
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Admin Panel</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.path === "/"
                    ? location.pathname === "/"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                    : location.pathname.startsWith(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div />
      </div>
    </header>
  );
};

export default AdminHeader;
