import { apiRequest } from "./http";

export type ProductImageItem = {
  id: number;
  url: string;
  isCover: boolean;
  sortOrder: number;
  createdAt: string;
};

export async function getProductImages(productId: number): Promise<ProductImageItem[]> {
  return apiRequest<ProductImageItem[]>(`/api/products/${productId}/images`);
}

export async function uploadProductImages(productId: number, files: File[]) {
  const form = new FormData();
  for (const f of files) {
    form.append("files", f);
  }

  // Do not set Content-Type manually for FormData.
  return apiRequest<{ message: string }>(`/api/products/${productId}/images`, {
    method: "POST",
    body: form,
  });
}

export async function deleteProductImage(productId: number, imageId: number) {
  return apiRequest<{ message: string }>(`/api/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
}

export async function setCoverProductImage(productId: number, imageId: number) {
  return apiRequest<{ message: string }>(
    `/api/products/${productId}/images/${imageId}/cover`,
    { method: "PUT" },
  );
}

export async function addProductImageUrls(productId: number, urls: string[]) {
  return apiRequest<{ message: string }>(`/api/products/${productId}/images/urls`, {
    method: "POST",
    body: { urls },
  });
}
