import { useCallback, useEffect, useMemo, useState } from "react";
import CartContext, { type CartItem } from "@/cart/CartContext";
import { AUTH_LOGOUT_EVENT } from "@/auth/authEvents";

const CART_KEY = "cartItems";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => x as CartItem)
      .filter((x) => typeof x.productId === "number" && typeof x.quantity === "number" && x.quantity > 0);
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    const onLogout = () => setItems([]);
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout);
  }, []);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    const q = Math.max(1, Math.floor(quantity));
    setItems((prev) => {
      const existing = prev.find((x) => x.productId === item.productId);
      if (!existing) return [...prev, { ...item, quantity: q }];
      return prev.map((x) =>
        x.productId === item.productId ? { ...x, quantity: x.quantity + q } : x
      );
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  }, []);

  const removeItems = useCallback((productIds: number[]) => {
    const idSet = new Set(productIds);
    setItems((prev) => prev.filter((x) => !idSet.has(x.productId)));
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    const q = Math.max(1, Math.floor(quantity));
    setItems((prev) => prev.map((x) => (x.productId === productId ? { ...x, quantity: q } : x)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalAmount = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [items]
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, x) => sum + x.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, removeItems, setQuantity, clear, totalAmount, totalQuantity }),
    [items, addItem, removeItem, removeItems, setQuantity, clear, totalAmount, totalQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
