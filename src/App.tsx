import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { ShoppingListProvider } from './context/ShoppingListContext';
import './fonts.css';
import Dashboard from './components/Dashboard/Dashboard';


const App: React.FC = () => {
  return (
    <ShoppingListProvider>
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
    </ShoppingListProvider>
  );
};

export default App;