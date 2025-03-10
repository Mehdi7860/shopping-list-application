export interface FormValues {
  itemName: string;
  category: string;
  subcategory: string;
  quantity: number;
  price: number;
  date: string;
}

export interface SubcategoriesMap {
  [key: string]: string[];
}

export interface ItemData {
  name: string;
  category: string;
  subcategory: string;
  qty: number;
  price: number;
  date: string;
}
