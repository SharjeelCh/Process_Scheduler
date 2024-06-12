import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { height, width } from "./Dimensions";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";

const OptionModal = ({ visible, onClose ,onPress,onPresspdf}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <StatusBar backgroundColor={"rgba(0, 0, 0, 0.3)"} />
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
                <FontAwesome
                  name="file-image-o"
                  size={width / 9.5}
                  color={"rgba(255,0,0,0.65)"}
                />
                <View style={styles.label}>
                  <Text style={styles.text}>JPG</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageContainer} onPress={onPresspdf}>
                <FontAwesome
                  name="file-text"
                  size={width / 9.5}
                  color={"rgba(0,0,255,0.45)"}
                />
                <View style={styles.label}>
                  <Text style={styles.text}>PDF</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OptionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: width,
    flexDirection: "row",
    height: height / 8.8,
    borderTopEndRadius: height / 30,
    borderTopLeftRadius: height / 30,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: width / 28,
  },
  imageContainer: {
    width: height / 13.5,
    height: height / 13.5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  imageStyle: {
    height: height / 8,
    width: height / 8,
  },
  text: {
    color: "white",
    fontSize: width / 40,
    fontStyle: "italic",
  },
  label: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,1)",
    borderRadius: 100,
    padding: width / 210,
    position: "absolute",
    right: width / 60,
    bottom: width / 180,
  },
});
