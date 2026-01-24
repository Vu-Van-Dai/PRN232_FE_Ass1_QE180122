import { useEffect, useMemo, useState } from "react";
import { 
  Pencil,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AdminHeader from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/api/products";

const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600";

const ProductDetailPage = () => {
  const params = useParams();
  const productId = Number(params.id);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: Number.isFinite(productId),
  });

  const productImages = useMemo(() => {
    const imgs = productQuery.data?.images ?? [];
    if (imgs.length > 0) {
      const cover = imgs.find((i) => i.isCover) ?? imgs[0];
      const rest = imgs.filter((i) => i.id !== cover.id);
      return [cover.url, ...rest.map((i) => i.url)];
    }

    const primary = productQuery.data?.imageUrl ?? fallbackImage;
    return [primary];
  }, [productQuery.data]);

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (selectedImage >= productImages.length) setSelectedImage(0);
  }, [productImages.length, selectedImage]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <span className="text-foreground font-medium">Product Detail</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-muted/30 mb-4">
              <span className="absolute top-4 left-4 z-10 bg-foreground text-background text-xs font-medium px-3 py-1 rounded">
                NEW ARRIVAL
              </span>
              <img
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="flex gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                {productQuery.data?.category?.name ?? ""}
              </span>
              {Number.isFinite(productId) ? (
                <Link to={`/admin/products/${productId}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Product
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" className="gap-1.5" disabled>
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Product
                </Button>
              )}
            </div>

            {productQuery.isLoading && (
              <div className="text-sm text-muted-foreground">Loading product...</div>
            )}
            {productQuery.isError && (
              <div className="text-sm text-destructive">Failed to load product.</div>
            )}

            <h1 className="text-3xl font-bold text-foreground mb-3">
              {productQuery.data?.name ?? "Product"}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                ${productQuery.data?.price?.toFixed(2) ?? "0.00"}
              </span>
            </div>

            <div className="space-y-4 text-muted-foreground mb-6">
              <p>{productQuery.data?.description ?? ""}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProductDetailPage;
