import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, List, Image } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import ImageUpload from "@/components/products/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductById, updateProduct } from "@/api/products";
import { getCategories } from "@/api/categories";
import { toast } from "sonner";

const toNumberOrUndefined = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
};

const EditProductPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();
  const productId = Number(params.id);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isFinite(productId),
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  useEffect(() => {
    if (!productQuery.data) return;
    setName(productQuery.data.name ?? "");
    setDescription(productQuery.data.description ?? "");
    setPrice(String(productQuery.data.price ?? ""));
    setCategoryId(productQuery.data.categoryId != null ? String(productQuery.data.categoryId) : "");
  }, [productQuery.data]);

  const canSubmit = useMemo(() => {
    const parsedPrice = toNumberOrUndefined(price) ?? 0;
    return (
      name.trim().length > 0 &&
      description.trim().length > 0 &&
      parsedPrice > 0 &&
      (categoriesQuery.data?.length ? categoryId.trim() !== "" : true)
    );
  }, [name, description, price, categoryId, categoriesQuery.data?.length]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProduct(productId, {
        name: name.trim(),
        description: description.trim(),
        price: toNumberOrUndefined(price) ?? 0,
        categoryId: categoryId ? Number(categoryId) : undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="p-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/admin/products" className="text-primary hover:underline">
            Products
          </Link>
          <span>›</span>
          <span className="text-primary">Edit Product</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
            <p className="text-muted-foreground mt-1">
              Update product details to match your inventory.
            </p>
          </div>
          <Link to={`/product/${productId}`}>
            <Button variant="outline" className="gap-2" disabled={!Number.isFinite(productId)}>
              <Eye className="w-4 h-4" />
              View
            </Button>
          </Link>
        </div>

        {productQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading product...</div>
        )}
        {productQuery.isError && (
          <div className="text-sm text-destructive">Failed to load product.</div>
        )}

        {/* Form */}
        {!productQuery.isLoading && !productQuery.isError && (
          <div className="space-y-6">
            {/* General Information */}
            <div className="card-admin p-6">
              <div className="flex items-center gap-2 mb-6">
                <List className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">General Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <Label className="text-foreground">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g., Wireless Noise-Cancelling Headphones"
                    className="mt-2 input-admin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-foreground">
                      Price <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">$</span>
                      <Input
                        placeholder="0.00"
                        className="pl-7 input-admin"
                        inputMode="decimal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground">
                      Category {categoriesQuery.data?.length ? <span className="text-destructive">*</span> : null}
                    </Label>
                    <div className="mt-2">
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="input-admin">
                          <SelectValue
                            placeholder={
                              categoriesQuery.isLoading
                                ? "Loading categories..."
                                : categoriesQuery.isError
                                  ? "Failed to load categories"
                                  : categoriesQuery.data?.length
                                    ? "Select a category"
                                    : "No categories yet"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(categoriesQuery.data ?? []).map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {!categoriesQuery.isLoading &&
                      !categoriesQuery.isError &&
                      (categoriesQuery.data?.length ?? 0) === 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Create a category first in Admin → Category.
                        </p>
                      )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Description</Label>
                    <span className="text-xs text-primary">Markdown supported</span>
                  </div>
                  <Textarea
                    placeholder="Describe the product features, specifications, and benefits..."
                    className="mt-2 min-h-[160px] input-admin resize-y"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Product Media */}
            <div className="card-admin p-6">
              <div className="flex items-center gap-2 mb-6">
                <Image className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Product Media</h2>
              </div>

              <ImageUpload
                productId={productId}
                existingImages={productQuery.data?.images}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Link to="/admin/products">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                className="gap-2"
                disabled={!canSubmit || updateMutation.isPending || !Number.isFinite(productId)}
                onClick={() => updateMutation.mutate()}
              >
                Save Changes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8">
          © 2024 Admin Console. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default EditProductPage;
