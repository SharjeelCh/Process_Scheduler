import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { height } from "./Components/Dimensions";
import ThemeContext from "./Components/ThemeContext";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const context = useContext(ThemeContext);
  const { mode, toggleThemeMode } = context;

  const letterAnimations = useRef(
    [...Array(17)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = letterAnimations.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, animations).start(() => {
      setLoading(false);
      router.replace("/Screens/Main");
    });
  }, []);

  const letters = "Process Scheduler".split("").map((letter, index) => (
    <Animated.Text
      key={index}
      style={[
        styles.text,
        { opacity: letterAnimations[index], color: mode ? "white" : "black" },
      ]}
    >
      {letter}
    </Animated.Text>
  ));

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: mode ? "rgba(0,0,0,0.8)" : "white",
      }}
    >
      <StatusBar
        translucent={true}
        backgroundColor={mode ? "rgba(0,0,0,0.8)" : "white"}
      />
      <View></View>
      <View style={styles.textContainer}>{letters}</View>
      {loading ? (
        <ActivityIndicator
          size={height / 28}
          color={mode ? "white" : "black"}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: height / 34,
    textShadowColor: "#FFA500",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  textContainer: {
    flexDirection: "row",
  },
});
