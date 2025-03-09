import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ItemData } from "../types/itemData"; // Import the ItemData interface
import mockData from "../json/mock-data.json";

// Define the context type
interface ShoppingListContextType {
  shoppingList: ItemData[];
  addItem: (item: ItemData) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updatedItem: ItemData) => void;
  clearList: () => void;
}

// Storage key for localStorage
const STORAGE_KEY = "zeta-shopping-list";

// Create the context with default values
const ShoppingListContext = createContext<ShoppingListContextType>({
  shoppingList: [],
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  clearList: () => {},
});

// Create a provider component
export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage if available, otherwise use mockData
  const [shoppingList, setShoppingList] = useState<ItemData[]>(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      // If we have stored data, use it; otherwise use the mock data
      return storedData ? JSON.parse(storedData) : mockData;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return mockData;
    }
  });

  // Save to localStorage whenever shoppingList changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shoppingList));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }, [shoppingList]);

  // Add a new item to the shopping list (at the beginning for newest-first sorting)
  const addItem = (item: ItemData) => {
    setShoppingList((prevList) => [item, ...prevList]);
  };

  // Remove an item from the shopping list
  const removeItem = (index: number) => {
    setShoppingList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Update an existing item
  const updateItem = (index: number, updatedItem: ItemData) => {
    setShoppingList((prevList) =>
      prevList.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  // Clear the entire shopping list
  const clearList = () => {
    setShoppingList([]);
  };

  return (
    <ShoppingListContext.Provider
      value={{ shoppingList, addItem, removeItem, updateItem, clearList }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

// Custom hook to use the shopping list context
export const useShoppingList = () => useContext(ShoppingListContext);
