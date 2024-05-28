import React from 'react';
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to About" onPress={() => router.push('/Screens/Main')} />
    </View>
  );
}
