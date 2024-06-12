import React, { useEffect, useRef } from "react";
import { View, Text, Button, Animated, Dimensions } from "react-native";

export default function CustomDrawer({ isOpen, setIsOpen }) {
  const { width, height } = Dimensions.get("window");
  const drawerWidth = useRef(new Animated.Value(0)).current;
  const drawerHeight = height / 3;

  useEffect(() => {
    Animated.timing(drawerWidth, {
      toValue: isOpen ? width/3 : 0,
      duration: 200,
      useNativeDriver: false,
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
        top: height/11,
        width: drawerWidth,
        height: drawerHeight,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        zIndex:1,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:20,
        elevation:5
      }}
    >
      <Text>Custom Drawer Content</Text>
    </Animated.View>
  );
}
