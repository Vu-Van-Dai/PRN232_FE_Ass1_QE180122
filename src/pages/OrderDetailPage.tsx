import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/api/orders";
import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

const fallbackImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Number.isFinite(orderId),
  });

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order detail</h1>
            {orderQuery.data && (
              <div className="text-sm text-muted-foreground mt-1">
                Order #{orderQuery.data.id} · Status: {orderQuery.data.status}
              </div>
            )}
          </div>
          <Link to="/orders">
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        {orderQuery.isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {orderQuery.isError && <div className="text-sm text-destructive">Failed to load order.</div>}

        {orderQuery.data && (
          <div className="card-admin p-6">
            <div className="space-y-4">
              {orderQuery.data.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={it.imageUrl ?? fallbackImage}
                      alt={it.productName}
                      className="w-16 h-16 rounded-lg object-contain bg-muted/30 p-2"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">{it.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(it.unitPrice)} × {it.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">{formatNumber(it.lineTotal)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-6 pt-4 flex items-center justify-between">
              <div className="text-muted-foreground">Total</div>
              <div className="text-xl font-bold text-foreground">{formatNumber(orderQuery.data.totalAmount)}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
