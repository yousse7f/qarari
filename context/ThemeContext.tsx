import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeColors = {
  primary: string;
  primaryLight: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
};

const lightColors: ThemeColors = {
  primary: '#02796e',
  primaryLight: '#DBEAFE',
  secondary: '#0EA5E9',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
};

const darkColors: ThemeColors = {
  primary: '#4babdbf0',
  primaryLight: '#1E3A8A',
  secondary: '#0EA5E9',
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#10B981',
  successLight: '#064E3B',
  warning: '#F59E0B',
  warningLight: '#78350F',
  error: '#EF4444',
  errorLight: '#7F1D1D',
};

type Theme = {
  dark: boolean;
  colors: ThemeColors;
};

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: { dark: false, colors: lightColors },
  isDark: false,
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then(value => {
      if (value === 'dark') setIsDark(true);
      else if (value === 'light') setIsDark(false);
      else setIsDark(colorScheme === 'dark');
    });
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDark(prevMode => {
      const newMode = !prevMode;
      AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const theme = {
    dark: isDark,
    colors: isDark ? lightColors : darkColors,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);