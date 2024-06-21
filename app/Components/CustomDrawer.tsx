import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { getThemeMode, saveThemeMode } from "../Components/Async";
import ThemeContext from "./ThemeContext";
import { useRouter } from "expo-router";

export default function CustomDrawer({ isOpen, setIsOpen }) {
  const { width, height } = Dimensions.get("window");
  const drawerWidth = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const drawerHeight = height / 5;
  const context=useContext(ThemeContext)
  const {mode,toggleThemeMode}= context;
  const router=useRouter();
  

  useEffect(() => {
    Animated.timing(drawerWidth, {
      toValue: isOpen ? width / 5 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(overlayOpacity, {
      toValue: isOpen ? 0.5 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const closeDrawer = () => {
    setIsOpen(false);
  };
 

  return (
    <Animated.View
      style={{
        position: "absolute",
        right: 0,
        top: height / 11,
        width: drawerWidth,
        height: drawerHeight,
        backgroundColor: mode ? "rgba(0,0,0,0.7)" : "#ddd",
        justifyContent: "space-evenly",
        alignItems: "center",
        zIndex: 1,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        elevation: 5,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontSize: width / 19,
            fontWeight: "800",
            letterSpacing: 2,
            color: mode ? "white" : "black",
          }}
        >
          PS
        </Text>
      </View>
      <TouchableOpacity onPress={toggleThemeMode}>
        <MaterialIcons
          name={mode ? "light-mode" : "dark-mode"}
          size={width / 12}
          color={mode ? "white" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>{router.navigate("/Screens/About")}}
      >
        <MaterialIcons
          name="info"
          size={width / 12}
          color={mode ? "white" : "black"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
