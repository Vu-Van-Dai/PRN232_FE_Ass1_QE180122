import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { useCart } from "@/cart/CartContext";
import { placeOrder } from "@/api/orders";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, totalAmount, clear } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const request = useMemo(
    () => ({ items: items.map((x) => ({ productId: x.productId, quantity: x.quantity })) }),
    [items]
  );

  const onPlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      await placeOrder(request);
      clear();
      toast.success("Order placed successfully");
      navigate("/orders", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>

        {items.length === 0 ? (
          <div className="card-admin p-6 text-muted-foreground">Your cart is empty.</div>
        ) : (
          <div className="card-admin p-6">
            <h2 className="text-lg font-semibold text-foreground">Confirm order</h2>
            <div className="mt-4 space-y-3">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between">
                  <div className="text-foreground">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(it.price)} × {it.quantity}
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">{formatNumber(it.price * it.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-6 pt-4 flex items-center justify-between">
              <div className="text-muted-foreground">Total</div>
              <div className="text-xl font-bold text-foreground">{formatNumber(totalAmount)}</div>
            </div>

            <Button className="w-full mt-6" onClick={onPlaceOrder} disabled={isSubmitting}>
              {isSubmitting ? "Placing..." : "Place order"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
