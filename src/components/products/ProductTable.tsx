import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryColor: "primary" | "secondary" | "accent";
  price: number;
  stock: number;
  stockStatus: "in" | "low" | "out";
  image: string;
}

const products: Product[] = [
  {
    id: "1024",
    name: "Wireless Headphones",
    sku: "WH-2024-BLK",
    category: "Electronics",
    categoryColor: "primary",
    price: 120.0,
    stock: 45,
    stockStatus: "in",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
  },
  {
    id: "1025",
    name: "Running Shoes",
    sku: "RS-FLY-002",
    category: "Apparel",
    categoryColor: "secondary",
    price: 85.5,
    stock: 3,
    stockStatus: "low",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
  },
  {
    id: "1026",
    name: "Mechanical Keyboard",
    sku: "MK-RGB-PRO",
    category: "Electronics",
    categoryColor: "primary",
    price: 150.0,
    stock: 120,
    stockStatus: "in",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100",
  },
  {
    id: "1027",
    name: "Modern Chair",
    sku: "FUR-CHAIR-01",
    category: "Home & Garden",
    categoryColor: "accent",
    price: 249.99,
    stock: 0,
    stockStatus: "out",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=100",
  },
  {
    id: "1028",
    name: "Smart Fitness Watch",
    sku: "SWT-FIT-09",
    category: "Electronics",
    categoryColor: "primary",
    price: 199.0,
    stock: 88,
    stockStatus: "in",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
  },
];

interface ProductTableProps {
  onDelete?: (id: string) => void;
}

const ProductTable = ({ onDelete }: ProductTableProps) => {
  const getStockBadge = (status: string, stock: number) => {
    switch (status) {
      case "in":
        return <span className="badge-stock-in">In Stock ({stock})</span>;
      case "low":
        return <span className="badge-stock-low">Low Stock ({stock})</span>;
      case "out":
        return <span className="badge-stock-out">Out of Stock</span>;
      default:
        return null;
    }
  };

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
                Category
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Price
              </th>
              <th className="text-left p-4 text-xs font-semibold text-primary uppercase tracking-wider">
                Stock
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
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-primary">SKU: {product.sku}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="badge-category">{product.category}</span>
                </td>
                <td className="p-4 font-medium text-foreground">${product.price.toFixed(2)}</td>
                <td className="p-4">{getStockBadge(product.stockStatus, product.stock)}</td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="w-4 h-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Pencil className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(product.id)}
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
