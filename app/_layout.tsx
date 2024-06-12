// _layout.js
import React from 'react';
import { ThemeProvider } from './Components/ThemeContext'; // Adjust the import path as necessary
import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <ThemeProvider>
      <Stack screenOptions={{headerShown:false}} />
    </ThemeProvider>
  );
};

export default RootLayout;
