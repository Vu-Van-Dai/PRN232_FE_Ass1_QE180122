import { apiRequest } from "@/api/http";
import type { CreateProductRequest, Product, UpdateProductRequest } from "@/types/product";

// BE routes (ClothingStore.API):
// GET    /api/products?search&minPrice&maxPrice&categoryId
// GET    /api/products/{id}
// POST   /api/products
// PUT    /api/products/{id}
// DELETE /api/products/{id}

export async function getProducts(params?: {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
}): Promise<Product[]> {
  return apiRequest<Product[]>("/api/products", { query: params });
}

export async function getProductById(id: number): Promise<Product> {
  return apiRequest<Product>(`/api/products/${id}`);
}

export async function createProduct(input: CreateProductRequest): Promise<Product> {
  return apiRequest<Product>("/api/products", { method: "POST", body: input });
}

// BE returns: { message: string, data: Product }
export async function updateProduct(id: number, input: UpdateProductRequest): Promise<Product> {
  const res = await apiRequest<{ message: string; data: Product }>(`/api/products/${id}`, {
    method: "PUT",
    body: input,
  });
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiRequest<void>(`/api/products/${id}`, { method: "DELETE" });
}
