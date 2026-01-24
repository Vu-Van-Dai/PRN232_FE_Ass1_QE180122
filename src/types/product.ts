export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  images?: Array<{
    id: number;
    url: string;
    isCover: boolean;
    sortOrder: number;
    createdAt: string;
  }>;
  imagePublicId?: string | null;
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
  } | null;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId?: number | null;
}

export type UpdateProductRequest = CreateProductRequest;
