import { Link, useNavigate } from "react-router-dom";
import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/cart/CartContext";
import { formatNumber } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

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
              {items.map((it) => (
                <div key={it.productId} className="card-admin p-4 flex gap-4 items-center">
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
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">{formatNumber(totalAmount)}</span>
              </div>
              <Button className="w-full mt-5" onClick={() => navigate("/checkout")}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
