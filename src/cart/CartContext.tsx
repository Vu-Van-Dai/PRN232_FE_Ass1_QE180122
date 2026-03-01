import { createContext, useContext } from "react";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  totalAmount: number;
  totalQuantity: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
