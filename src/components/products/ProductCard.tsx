import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  isOnSale?: boolean;
}

const ProductCard = ({
  id,
  name,
  category,
  price,
  originalPrice,
  image,
  isOnSale = false,
}: ProductCardProps) => {
  return (
    <div className="card-admin overflow-hidden group animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {isOnSale && (
          <span className="badge-sale absolute top-3 left-3 z-10">SALE</span>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <p className="text-sm text-primary mb-3">{category}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className={`font-bold ${isOnSale ? "text-destructive" : "text-foreground"}`}>
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
