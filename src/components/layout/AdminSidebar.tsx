import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen p-4">
      <div className="flex items-center gap-3 px-2 mb-8">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100" />
          <AvatarFallback className="bg-amber-700">AC</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-sidebar-foreground">Admin Console</span>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={isActive ? "nav-link-active" : "nav-link"}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
