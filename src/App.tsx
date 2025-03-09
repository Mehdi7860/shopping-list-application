import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import MainLayout from './MainLayout';
import { ShoppingListProvider } from './context/ShoppingListContext';
import './fonts.css';


const App: React.FC = () => {
  return (
    <ShoppingListProvider>
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
    </ShoppingListProvider>
  );
};

export default App;