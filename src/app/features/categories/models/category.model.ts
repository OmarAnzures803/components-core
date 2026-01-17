export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
}
