import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: number, name: string) => void;
}

const ProductTable = ({ products, onDelete }: ProductTableProps) => {
  const navigate = useNavigate();
  const fallbackImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100";

  return (
    <div className="card-admin overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 w-12">
                <Checkbox />
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                ID
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Image
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Product Name
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Price
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Category
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Created
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <Checkbox />
                </td>
                <td className="p-4 text-sm text-primary font-medium">#{product.id}</td>
                <td className="p-4">
                  <img
                    src={product.imageUrl ?? fallbackImage}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-primary line-clamp-1">{product.description}</p>
                  </div>
                </td>
                <td className="p-4 font-medium text-foreground">${product.price.toFixed(2)}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {product.category?.name ?? "—"}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onSelect={() => navigate(`/product/${product.id}`)}
                      >
                        <Eye className="w-4 h-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer"
                        onSelect={() => navigate(`/admin/products/${product.id}/edit`)}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onSelect={() => onDelete?.(product.id, product.name)}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
