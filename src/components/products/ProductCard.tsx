import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatNumber } from "@/lib/utils";
import { useCart } from "@/cart/CartContext";
import { toast } from "sonner";
import { Eye, ShoppingCart } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
}

const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
}: ProductCardProps) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const resolvedImageUrl =
    imageUrl ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";

  return (
    <div className="card-admin overflow-hidden group animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-muted/30 p-3">
        <img
          src={resolvedImageUrl}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <p className="text-sm text-primary mb-3">Product</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">
              {formatNumber(price)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (!user) {
                  navigate("/login", { state: { from: location.pathname } });
                  return;
                }
                addItem({ productId: id, name, price, imageUrl: resolvedImageUrl }, 1);
                toast.success("Added to cart");
              }}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Link to={`/product/${id}`}>
              <Button variant="outline" size="icon" aria-label="View detail">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
