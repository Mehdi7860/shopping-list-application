import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  currentTheme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get theme from localStorage or default to 'light'
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'light';
  });
  
  // Calculate if it's dark mode
  const isDarkMode = currentTheme === 'dark';
  
  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    
    // Update HTML element for global CSS targeting
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);
  
  const toggleTheme = () => {
    setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme);
  };
  
  // Ant Design algorithm selection based on theme
  const algorithm = currentTheme === 'light' 
    ? theme.defaultAlgorithm 
    : theme.darkAlgorithm;
  
  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, setTheme, isDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: algorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};