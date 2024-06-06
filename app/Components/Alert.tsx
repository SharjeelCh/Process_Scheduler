import React, { useEffect } from "react";
import { View, Text, Modal } from "react-native";
import { Button, Portal, PaperProvider } from "react-native-paper";
import { height, width } from "./Dimensions";
import Icon from "react-native-vector-icons/FontAwesome5";

const Alert = ({ showmodal, closemodal, setshowmodal, text, icon  }) => {
  useEffect(() => {
    if (showmodal) {
      setTimeout(() => {
        setshowmodal(false);
      }, 1000);
    }
  }, [showmodal]);

  return (
    <Modal
      visible={showmodal}
      onDismiss={closemodal}
      transparent={true}
      animationType='fade'
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: height / 130,
        }}
      >
        <View
          style={{
            width: "76%",
            height: height / 23,
            backgroundColor: "rgba(128, 128, 128, 1)",
            padding: width / 36,
            alignItems: "center",
            borderRadius: width / 2,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
            <Icon name={icon} size={10} color={"white"} />

          <Text
            style={{
              fontWeight: "600",
              fontSize: width / 30,
              letterSpacing: width / 130,
              marginHorizontal: width / 30,
              color: "white",
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
