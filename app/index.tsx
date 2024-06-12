import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import AnimatedSplash from "react-native-animated-splash-screen";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1200);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      router.replace("/Screens/Main");
    }
  }, [isLoaded]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent={true}
        backgroundColor="rgba(173, 216, 230, 0.8)"
      />
      <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={require("../assets/icon.png")}
        backgroundColor={"rgba(173, 216, 230, 0.8)"}
        logoHeight={100}
        logoWidth={100}
      />
    </View>
  );
}
