export interface ItemData {
  name: string;
  category: string;
  subcategory: string;
  qty: number;
  price: number;
  date: string;
  isNew?: boolean;
}

export type FilterValues = {
  category?: string;
  subcategory?: string;
  searchText?: string;
};
