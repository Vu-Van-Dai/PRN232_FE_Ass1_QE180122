export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  userId: string;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled" | string;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{ productId: number; quantity: number }>;
}
