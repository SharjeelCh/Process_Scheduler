import React, { useEffect } from "react";
import { View, Text, Modal } from "react-native";
import { Button, Portal, PaperProvider } from "react-native-paper";
import { height, width } from "./Dimensions";
import { FontAwesome5 } from "@expo/vector-icons";

const DownloadModal = ({ showmodal, closemodal, setshowmodal, text }) => {
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
      animationType="slide"
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
            width: "78%",
            height: height / 23,
            backgroundColor: "rgba(128, 128, 128, 1)",

            padding: width / 30,
            alignItems: "center",
            borderRadius: width / 2,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {text == "Image Saved to Gallery" && (
            <FontAwesome5 name="check-circle" size={12} color={"white"} />
          )}

          <Text
            style={{
              fontWeight: "600",
              fontSize: width / 30,
              letterSpacing: width / 99,
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

export default DownloadModal;
