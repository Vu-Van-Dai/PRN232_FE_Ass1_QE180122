import { apiRequest } from "@/api/http";
import type { CreateOrderRequest, Order } from "@/types/order";

export async function placeOrder(input: CreateOrderRequest): Promise<Order> {
  return apiRequest<Order>("/api/orders", { method: "POST", body: input });
}

export async function getMyOrders(): Promise<Order[]> {
  return apiRequest<Order[]>("/api/orders/my");
}

export async function getOrderById(id: number): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}`);
}
