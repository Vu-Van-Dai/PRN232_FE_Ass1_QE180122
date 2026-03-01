import { apiRequest } from "@/api/http";
import type { PayOSPaymentLink } from "@/types/payment";
import type { CreateOrderRequest } from "@/types/order";

export async function createPayOSPaymentLinkFromCart(input: CreateOrderRequest): Promise<PayOSPaymentLink> {
  return apiRequest<PayOSPaymentLink>(`/api/payments/payos-link`, {
    method: "POST",
    body: input,
  });
}

export async function createPayOSPaymentLink(orderId: number): Promise<PayOSPaymentLink> {
  return apiRequest<PayOSPaymentLink>(`/api/orders/${orderId}/payos-link`, {
    method: "POST",
  });
}
