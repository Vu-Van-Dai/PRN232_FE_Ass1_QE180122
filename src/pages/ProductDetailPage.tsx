import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/api/products";
import { formatNumber } from "@/lib/utils";
import { useCart } from "@/cart/CartContext";
import { toast } from "sonner";

const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const { addItem } = useCart();

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

  const onAddToCart = () => {
    const p = productQuery.data;
    if (!p) return;
    addItem({ productId: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl ?? null }, 1);
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Product detail</h1>
          <Link to="/cart">
            <Button variant="outline">Go to cart</Button>
          </Link>
        </div>

        {productQuery.isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {productQuery.isError && <div className="text-sm text-destructive">Failed to load product.</div>}

        {productQuery.data && (
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-muted/30 mb-4 p-4">
                <img
                  src={productImages[selectedImage]}
                  alt={productQuery.data.name}
                  className="w-full aspect-square object-contain"
                />
              </div>
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors bg-muted/30 p-1 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-primary uppercase tracking-wide">
                {productQuery.data.category?.name ?? ""}
              </div>
              <h2 className="text-3xl font-bold text-foreground mt-2">{productQuery.data.name}</h2>
              <div className="text-3xl font-bold text-primary mt-4">{formatNumber(productQuery.data.price)}</div>

              <div className="mt-6 text-muted-foreground">
                <p>{productQuery.data.description}</p>
              </div>

              <Button className="mt-8 w-full" onClick={onAddToCart}>
                Add to cart
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
