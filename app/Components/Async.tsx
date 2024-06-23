import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveThemeMode = async (isDarkMode) => {
  try {
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    
  } catch (error) {
    console.error('Error saving theme mode:', error);
  }
};

export const getThemeMode = async () => {
  try {
    const mode = await AsyncStorage.getItem('isDarkMode');
    
    return mode !== null ? JSON.parse(mode) : false; 
  } catch (error) {
    console.error('Error getting theme mode:', error);
    return false; 
  }
};
