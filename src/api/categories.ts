import { apiRequest } from "@/api/http";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

// BE routes (ClothingStore.API):
// GET    /api/categories?search
// GET    /api/categories/{id}
// POST   /api/categories
// PUT    /api/categories/{id}
// DELETE /api/categories/{id}

export async function getCategories(params?: { search?: string }): Promise<Category[]> {
  return apiRequest<Category[]>("/api/categories", { query: params });
}

export async function getCategoryById(id: number): Promise<Category> {
  return apiRequest<Category>(`/api/categories/${id}`);
}

export async function createCategory(input: CreateCategoryRequest): Promise<Category> {
  return apiRequest<Category>("/api/categories", { method: "POST", body: input });
}

// BE returns: { message: string, data: Category }
export async function updateCategory(id: number, input: UpdateCategoryRequest): Promise<Category> {
  const res = await apiRequest<{ message: string; data: Category }>(`/api/categories/${id}`, {
    method: "PUT",
    body: input,
  });
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiRequest<void>(`/api/categories/${id}`, { method: "DELETE" });
}
