import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShopHeader from "@/components/layout/ShopHeader";
import { Button } from "@/components/ui/button";
import { useCart } from "@/cart/CartContext";
import { placeOrder } from "@/api/orders";
import { createPayOSPaymentLinkFromCart } from "@/api/payments";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";
import * as QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { PayOSPaymentLink } from "@/types/payment";
import { apiRequest } from "@/api/http";

export default function CheckoutPage() {
  const { items, removeItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "payos">("cod");
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payosLink, setPayosLink] = useState<PayOSPaymentLink | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  type PayOSPaymentStatus = { orderCode: number; status: string; isPaid: boolean };

  const selectedProductIdsFromState = (location.state as { selectedProductIds?: unknown } | null)
    ?.selectedProductIds;

  const selectedIdSet = useMemo(() => {
    if (!Array.isArray(selectedProductIdsFromState)) return null;
    const ids = selectedProductIdsFromState.filter((x): x is number => typeof x === "number");
    return new Set(ids);
  }, [selectedProductIdsFromState]);

  const selectedItems = useMemo(() => {
    if (!selectedIdSet) return items;
    return items.filter((x) => selectedIdSet.has(x.productId));
  }, [items, selectedIdSet]);

  const selectedTotalAmount = useMemo(
    () => selectedItems.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [selectedItems]
  );

  const request = useMemo(
    () => ({ items: selectedItems.map((x) => ({ productId: x.productId, quantity: x.quantity })) }),
    [selectedItems]
  );

  const purchasedProductIds = useMemo(
    () => selectedItems.map((x) => x.productId),
    [selectedItems]
  );

  useEffect(() => {
    if (!payDialogOpen || !payosLink) return;

    let isStopped = false;
    const interval = window.setInterval(async () => {
      if (isStopped) return;
      try {
        const st = await apiRequest<PayOSPaymentStatus>(`/api/payments/payos-status/${payosLink.orderCode}`);
        if (st.isPaid) {
          isStopped = true;
          window.clearInterval(interval);

          // Only now create order.
          await placeOrder(request);
          removeItems(purchasedProductIds);
          toast.success("Order placed successfully");
          setPayDialogOpen(false);
          navigate("/orders", { replace: true });
        }
      } catch {
        // ignore transient errors while polling
      }
    }, 2500);

    return () => {
      isStopped = true;
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payDialogOpen, payosLink?.orderCode]);

  const onPlaceOrder = async () => {
    if (selectedItems.length === 0) return;
    setIsSubmitting(true);
    try {
      if (paymentMethod === "payos") {
        const link = await createPayOSPaymentLinkFromCart(request);
        const dataUrl = await QRCode.toDataURL(link.qrCode, { width: 260, margin: 1 });
        setPayosLink(link);
        setQrDataUrl(dataUrl);
        setPayDialogOpen(true);
        return;
      }

      await placeOrder(request);

      removeItems(purchasedProductIds);
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

        {selectedItems.length === 0 ? (
          <div className="card-admin p-6 text-muted-foreground">
            No items selected.
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate("/cart")}>Back to cart</Button>
            </div>
          </div>
        ) : (
          <div className="card-admin p-6">
            <h2 className="text-lg font-semibold text-foreground">Confirm order</h2>

            <div className="mt-5">
              <div className="text-sm font-medium text-foreground mb-3">Payment method</div>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v === "payos" ? "payos" : "cod")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="pm-cod" />
                  <Label htmlFor="pm-cod">Cash on delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payos" id="pm-payos" />
                  <Label htmlFor="pm-payos">Bank transfer</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mt-4 space-y-3">
              {selectedItems.map((it) => (
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
              <div className="text-xl font-bold text-foreground">{formatNumber(selectedTotalAmount)}</div>
            </div>

            <Button className="w-full mt-6" onClick={onPlaceOrder} disabled={isSubmitting}>
              {isSubmitting ? "Placing..." : "Place order"}
            </Button>
          </div>
        )}
      </main>

      <Dialog
        open={payDialogOpen}
        onOpenChange={(open) => {
          setPayDialogOpen(open);
          if (!open) {
            setPayosLink(null);
            setQrDataUrl(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quét QR để thanh toán</DialogTitle>
            <DialogDescription>
              Số tiền: {formatNumber(payosLink?.amount ?? selectedTotalAmount)}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="PayOS QR" className="w-[260px] h-[260px]" />
            ) : (
              <div className="text-sm text-muted-foreground">Generating QR...</div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">Đang chờ thanh toán...</div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPayDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
