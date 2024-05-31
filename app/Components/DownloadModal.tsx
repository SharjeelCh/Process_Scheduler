import React, { useEffect } from "react";
import { View, Text, Modal } from "react-native";
import { Button, Portal, PaperProvider } from "react-native-paper";
import { height, width } from "./Dimensions";
import Icon from "react-native-vector-icons/FontAwesome5";

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
            width: "86%",
            height: height / 20,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: width / 30,
            alignItems: "center",
            borderRadius: width / 2,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {text == "Image Saved to Gallery" && (
            <Icon name="check-circle" size={14} color={"white"} />
          )}

          <Text
            style={{
              fontWeight: "600",
              fontSize: width / 27,
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
