import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { saveThemeMode, getThemeMode } from '../Components/Async'; 

interface ThemeContextType {
  mode: boolean;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setmode] = useState(false);

  useEffect(() => {
    const fetchThemeMode = async () => {
      const mode = await getThemeMode();
      
      setmode(mode);
    };

    fetchThemeMode();
  }, []);

  const toggleThemeMode = async () => {
    const newMode = !mode;
    setmode(newMode);
    
    await saveThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
