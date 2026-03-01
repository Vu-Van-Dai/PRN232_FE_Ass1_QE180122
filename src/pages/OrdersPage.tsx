import ShopHeader from "@/components/layout/ShopHeader";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/api/orders";
import { formatNumber } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => getMyOrders(),
  });

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Order history</h1>

        {ordersQuery.isLoading && (
          <div className="text-sm text-muted-foreground">Loading orders...</div>
        )}
        {ordersQuery.isError && (
          <div className="text-sm text-destructive">Failed to load orders.</div>
        )}

        <div className="space-y-4">
          {(ordersQuery.data ?? []).map((o) => (
            <div key={o.id} className="card-admin p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Order #{o.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()} · Status: {o.status}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-foreground">{formatNumber(o.totalAmount)}</div>
                  <Link to={`/orders/${o.id}`}>
                    <Button variant="outline" size="sm">Chi tiết</Button>
                  </Link>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4 space-y-2">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-sm">
                    <div className="text-foreground">
                      {it.productName} × {it.quantity}
                    </div>
                    <div className="text-muted-foreground">{formatNumber(it.lineTotal)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!ordersQuery.isLoading && (ordersQuery.data ?? []).length === 0 && (
            <div className="card-admin p-6 text-muted-foreground">No orders yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}
