import React, { useContext } from "react";
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
import ThemeContext from "./ThemeContext";

const OptionModal = ({ visible, onClose, onPress, onPresspdf }) => {
  const context = useContext(ThemeContext);
  const { mode, toggleThemeMode } = context;
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <StatusBar
        backgroundColor={mode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.3)"}
      />
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                { backgroundColor: mode ? "rgba(128,128,128,1)" : "white" },
              ]}
            >
              <View style={{ alignItems: "center", gap: width / 36 }}>
                <TouchableOpacity
                  style={[
                    styles.imageContainer,
                    { borderColor: mode ? "white" : "black" },
                  ]}
                  onPress={onPress}
                >
                  <FontAwesome
                    name="file-image-o"
                    size={width / 17}
                    color={mode ? "rgba(255,255,0,1)" : "rgba(255,0,0,0.65)"}
                  />
                </TouchableOpacity>
                <View>
                  <Text
                    style={[styles.text, { color: mode ? "white" : "black" }]}
                  >
                    JPG
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: "center", gap: width / 36 }}>
                <TouchableOpacity
                  style={[
                    styles.imageContainer,
                    { borderColor: mode ? "white" : "black" },
                  ]}
                  onPress={onPresspdf}
                >
                  <FontAwesome
                    name="file-text"
                    size={width / 17}
                    color={
                      mode ? "rgba(173, 216, 230, 1)" : "rgba(0,0,255,0.45)"
                    }
                  />
                </TouchableOpacity>
                <View>
                  <Text
                    style={[styles.text, { color: mode ? "white" : "black" }]}
                  >
                    PDF
                  </Text>
                </View>
              </View>
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
    width: width,
    flexDirection: "row",
    height: height / 6.8,
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
    borderWidth: 0.4,
    borderRadius: 100,
  },
  imageStyle: {
    height: height / 8,
    width: height / 8,
  },
  text: {
    fontSize: width / 28,
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
