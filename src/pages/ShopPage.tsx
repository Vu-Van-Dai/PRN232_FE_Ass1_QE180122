import { useMemo, useState } from "react";
import ShopHeader from "@/components/layout/ShopHeader";
import ProductCard from "@/components/products/ProductCard";
import AdminPagination from "@/components/admin/AdminPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import { getCategories } from "@/api/categories";
import type { Product } from "@/types/product";
import { formatPriceInput, parsePriceInput } from "@/lib/utils";

const ShopPage = () => {
  const { user, isLoading } = useAuth();

  if (!isLoading && user?.role === "Admin") {
    return <Navigate to="/admin/products" replace />;
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const minPrice = parsePriceInput(minPriceInput);
  const maxPrice = parsePriceInput(maxPriceInput);

  const productsQuery = useQuery({
    queryKey: ["products", { search, minPrice, maxPrice }],
    queryFn: () =>
      getProducts({
        search: search.trim() || undefined,
        minPrice,
        maxPrice,
      }),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const itemsPerPage = 8;
  const products: Product[] = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);
  const filteredProducts = useMemo(() => {
    if (selectedCategoryIds.length === 0) return products;
    return products.filter((p) => p.categoryId != null && selectedCategoryIds.includes(p.categoryId));
  }, [products, selectedCategoryIds]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const toggleCategoryId = (id: number) => {
    setSelectedCategoryIds((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      return next;
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSelectedCategoryIds([]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader search={search} onSearchChange={handleSearchChange} />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="card-admin p-5 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Search</h4>
                <Input
                  placeholder="Search by name..."
                  className="input-admin text-sm"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="$ Min"
                    className="input-admin text-sm"
                    inputMode="numeric"
                    value={minPriceInput}
                    onChange={(e) => {
                      setMinPriceInput(formatPriceInput(e.target.value));
                      setCurrentPage(1);
                    }}
                  />
                  <Input
                    placeholder="$ Max"
                    className="input-admin text-sm"
                    inputMode="numeric"
                    value={maxPriceInput}
                    onChange={(e) => {
                      setMaxPriceInput(formatPriceInput(e.target.value));
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <Button className="w-full mt-3" size="sm" onClick={() => productsQuery.refetch()}>
                  Apply Filter
                </Button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
                <div className="space-y-3">
                  {categoriesQuery.isLoading && (
                    <div className="text-sm text-muted-foreground">Loading categories...</div>
                  )}
                  {categoriesQuery.isError && (
                    <div className="text-sm text-destructive">Failed to load categories.</div>
                  )}

                  {(categoriesQuery.data ?? []).map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={selectedCategoryIds.includes(category.id)}
                        onCheckedChange={() => toggleCategoryId(category.id)}
                      />
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {category.name}
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
              <h1 className="text-2xl font-bold text-foreground">All Products</h1>
            </div>

            {productsQuery.isLoading && (
              <div className="text-sm text-muted-foreground">Loading products...</div>
            )}
            {productsQuery.isError && (
              <div className="text-sm text-destructive">Failed to load products.</div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {pagedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(Math.min(Math.max(1, p), totalPages))}
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
          <p className="text-sm text-muted-foreground">© 2024 E-Shop Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default ShopPage;
