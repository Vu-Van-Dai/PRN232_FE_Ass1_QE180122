import { Link } from "react-router-dom";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fade-in">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Package className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          E-Commerce Admin
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
          Quản lý sản phẩm, đơn hàng và khách hàng của bạn với giao diện admin hiện đại.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/admin/products">
            <Button size="lg" className="gap-2 h-12 px-6">
              <Package className="w-5 h-5" />
              Admin Panel
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/shop">
            <Button size="lg" variant="outline" className="gap-2 h-12 px-6">
              <ShoppingBag className="w-5 h-5" />
              View Shop
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <Link 
            to="/admin/products" 
            className="card-admin p-6 hover:border-primary/50 transition-colors group"
          >
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              Quản lý sản phẩm
            </h3>
            <p className="text-sm text-muted-foreground">
              Xem, tìm kiếm và quản lý kho hàng
            </p>
          </Link>
          <Link 
            to="/admin/products/new" 
            className="card-admin p-6 hover:border-primary/50 transition-colors group"
          >
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              Thêm sản phẩm
            </h3>
            <p className="text-sm text-muted-foreground">
              Tạo sản phẩm mới với form đầy đủ
            </p>
          </Link>
          <Link 
            to="/product/1" 
            className="card-admin p-6 hover:border-primary/50 transition-colors group"
          >
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              Chi tiết sản phẩm
            </h3>
            <p className="text-sm text-muted-foreground">
              Xem trang chi tiết với reviews
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
