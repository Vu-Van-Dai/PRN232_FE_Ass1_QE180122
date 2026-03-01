export interface PayOSPaymentLink {
  paymentLinkId: string;
  orderCode: number;
  amount: number;
  description: string;
  checkoutUrl: string;
  qrCode: string;
}
