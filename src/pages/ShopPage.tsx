import { useState } from "react";
import ShopHeader from "@/components/layout/ShopHeader";
import ProductCard from "@/components/products/ProductCard";
import AdminPagination from "@/components/admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const products = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    category: "Audio & Sound",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    category: "Wearables",
    price: 199.0,
    originalPrice: 250.0,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    isOnSale: true,
  },
  {
    id: "3",
    name: "Nike Air Max 270",
    category: "Shoes",
    price: 160.0,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  },
  {
    id: "4",
    name: "Polaroid OneStep 2",
    category: "Cameras",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
  },
  {
    id: "5",
    name: "Classic Chronograph Watch",
    category: "Accessories",
    price: 350.0,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
  },
  {
    id: "6",
    name: "Retro Sunglasses",
    category: "Accessories",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
  },
  {
    id: "7",
    name: "Ceramic Vase",
    category: "Home Decor",
    price: 32.0,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400",
  },
  {
    id: "8",
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 299.0,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
  },
];

const categories = ["Electronics", "Clothing", "Home & Garden", "Sports"];

const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Clothing"]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="card-admin p-5 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <button className="text-sm text-primary hover:underline">Reset</button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <Input placeholder="$ Min" className="input-admin text-sm" />
                  <Input placeholder="$ Max" className="input-admin text-sm" />
                </div>
                <Button className="w-full mt-3" size="sm">
                  Apply Filter
                </Button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Featured Products</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-44 border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <AdminPagination
                currentPage={currentPage}
                totalPages={8}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center rotate-180">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">E-Shop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 E-Shop Inc. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ShopPage;
