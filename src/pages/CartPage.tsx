import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCart } from "@/cart/CartContext";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>(() =>
    items.map((x) => x.productId)
  );

  useEffect(() => {
    setSelectedProductIds((prev) => {
      const prevSet = new Set(prev);
      const currentIds = items.map((x) => x.productId);
      const currentSet = new Set(currentIds);

      const kept = prev.filter((id) => currentSet.has(id));
      const keptSet = new Set(kept);
      const added = currentIds.filter((id) => !prevSet.has(id) && !keptSet.has(id));
      return [...kept, ...added];
    });
  }, [items]);

  const selectedIdSet = useMemo(() => new Set(selectedProductIds), [selectedProductIds]);
  const selectedItems = useMemo(
    () => items.filter((x) => selectedIdSet.has(x.productId)),
    [items, selectedIdSet]
  );
  const selectedTotalAmount = useMemo(
    () => selectedItems.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [selectedItems]
  );

  const allChecked = items.length > 0 && selectedProductIds.length === items.length;
  const someChecked = selectedProductIds.length > 0 && selectedProductIds.length < items.length;

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Cart</h1>
          <Link to="/">
            <Button variant="outline">Continue shopping</Button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card-admin p-6 text-muted-foreground">Your cart is empty.</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="card-admin p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={allChecked ? true : someChecked ? "indeterminate" : false}
                    onCheckedChange={(v) => {
                      if (v) setSelectedProductIds(items.map((x) => x.productId));
                      else setSelectedProductIds([]);
                    }}
                  />
                  <div className="text-sm text-muted-foreground">Select all</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedProductIds.length}/{items.length}
                </div>
              </div>

              {items.map((it) => (
                <div key={it.productId} className="card-admin p-4 flex gap-4 items-center">
                  <Checkbox
                    checked={selectedIdSet.has(it.productId)}
                    onCheckedChange={(v) => {
                      setSelectedProductIds((prev) => {
                        const s = new Set(prev);
                        if (v) s.add(it.productId);
                        else s.delete(it.productId);
                        return Array.from(s);
                      });
                    }}
                  />
                  <img
                    src={it.imageUrl ?? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                    alt={it.name}
                    className="w-20 h-20 rounded-lg object-contain bg-muted/30 p-2"
                  />
                  <div className="flex-1">
                    <Link to={`/product/${it.productId}`} className="font-semibold text-foreground hover:underline">
                      {it.name}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-1">{formatNumber(it.price)}</div>
                  </div>
                  <div className="w-24">
                    <Input
                      className="input-admin"
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => setQuantity(it.productId, Number(e.target.value))}
                    />
                  </div>
                  <div className="w-28 text-right font-semibold text-foreground">
                    {formatNumber(it.price * it.quantity)}
                  </div>
                  <Button variant="outline" onClick={() => removeItem(it.productId)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div className="card-admin p-5 h-fit">
              <h2 className="text-lg font-semibold text-foreground">Summary</h2>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">Total (selected)</span>
                <span className="text-lg font-bold text-foreground">{formatNumber(selectedTotalAmount)}</span>
              </div>
              <Button
                className="w-full mt-5"
                onClick={() => {
                  if (selectedProductIds.length === 0) {
                    toast.error("Please select at least one item");
                    return;
                  }
                  navigate("/checkout", { state: { selectedProductIds } });
                }}
                disabled={selectedProductIds.length === 0}
              >
                Checkout selected
              </Button>
              <div className="mt-3 text-xs text-muted-foreground">Cart total: {formatNumber(totalAmount)}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
