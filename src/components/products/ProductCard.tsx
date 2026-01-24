import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  const resolvedImageUrl =
    imageUrl ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";

  return (
    <div className="card-admin overflow-hidden group animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={resolvedImageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <p className="text-sm text-primary mb-3">Product</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">
              ${price.toFixed(2)}
            </span>
          </div>
          <Link to={`/product/${id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              View Detail
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
