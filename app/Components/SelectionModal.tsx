import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  FlatList,
  VirtualizedList,
  ScrollView,
} from "react-native";
import { height, width } from "./Dimensions";
import { Picker } from "@react-native-picker/picker";
import RadioButtonRN from "radio-buttons-react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RadioButton, Checkbox } from "react-native-paper";

const SelectionModal = ({
  visible,
  value,
  onValueChange,
  onClose,
  setCustom,
  custom,
}) => {
  const [textinput, settextinput] = useState("");
  const [lockti, setlockti] = useState(true);
  const [showfcfs, setshowfcfs] = useState(false);
  const [showsjf, setshowsjf] = useState(false);
  const [showps, setshowps] = useState(false);
  const [showrr, setshowrr] = useState(false);
  const [showsrr, setshowsrr] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [dataObjectps, setDataObjectps] = useState(null);
  const [dataObjectrr, setDataObjectrr] = useState(null);
  const [dataObjectsrr, setDataObjectsrr] = useState(null);

  const handleRadioButtonPress = () => {
    setCustom(!custom);
  };

  const handleCreateObject = () => {
    const num = parseInt(textinput, 10);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid number greater than 0");
      return;
    }
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push({ id: i, arrivalTime: 0, burstTime: 5 });
    }
    setDataObject(arr);
  };

  const handleCreateObjectPrioritySheduling = () => {
    const num = parseInt(textinput, 10);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid number greater than 0");
      return;
    }
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push({ id: i, arrivalTime: 0, burstTime: 5, priority: 1 });
    }
    setDataObjectps(arr);
  };

  const handleCreateObjectRoundRobin = () => {
    const num = parseInt(textinput, 10);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid number greater than 0");
      return;
    }
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push({ id: i, arrivalTime: 0, burstTime: 5, tq: 2, priority: 1 });
    }
    setDataObjectrr(arr);
  };

  const handleCreateObjectRoundRobinSimple = () => {
    const num = parseInt(textinput, 10);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid number greater than 0");
      return;
    }
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push({ id: i, arrivalTime: 0, burstTime: 5, tq: 2 });
    }
    setDataObjectsrr(arr);
  };

  const handleNumofProcesses = (num: any) => {
    if (!num) {
      ToastAndroid.show(
        "Number of processes cannot be empty",
        ToastAndroid.BOTTOM
      );
    } else {
      if (value == "First Come First Serve") {
        setlockti(false);
        handleCreateObject();
        setshowfcfs(true);

        console.log("fcfs");
      } else if (value == "Shortest Job First (SJF)") {
        setlockti(false);
        handleCreateObject();
        setshowsjf(true);
        console.log("sjf");
      } else if (value == "Priority Scheduling") {
        setlockti(false);
        handleCreateObjectPrioritySheduling();
        setshowps(true);
        console.log("ps");
      } else if (value == "Round Robin with Priority") {
        setlockti(false);
        handleCreateObjectRoundRobin();
        setshowrr(true);
        console.log("rr");
      } else if (value == "Round Robin") {
        setlockti(false);
        handleCreateObjectRoundRobinSimple();
        setshowsrr(true);
        console.log("srr");
      }
    }
  };

  const FCFSview = () => {
    return (
      <FlatList
        style={{ height: height / 2.6 }}
        data={dataObject}
        scrollEnabled={true}
        renderItem={({ item }) => {
          return (
            <ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: width / 30,
                }}
              >
                <View>
                  <Text style={{ fontSize: width / 24 }}>PID : {item.id}</Text>
                </View>
                <View
                  style={{
                    width: width / 4.6,
                    height: height / 17,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="AT"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
                <View
                  style={{
                    width: width / 4.6,
                    height: height / 17,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="BT"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  const PSview = () => {
    return (
      <FlatList
        style={{ height: height / 2.6 }}
        data={dataObjectps}
        scrollEnabled={true}
        renderItem={({ item }) => {
          return (
            <ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: width / 30,
                }}
              >
                <View>
                  <Text style={{ fontSize: width / 24 }}>PID : {item.id}</Text>
                </View>
                <View
                  style={{
                    width: width / 6.5,
                    height: height / 21,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="AT"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
                <View
                  style={{
                    width: width / 6.5,
                    height: height / 21,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="BT"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
                <View
                  style={{
                    width: width / 6.5,
                    height: height / 21,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="Priority"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  const RRview = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ fontSize: width / 24 }}>Time Quantum:</Text>

          <View
            style={{
              width: width / 4.6,
              height: height / 17,
              borderWidth: 0.25,
              borderColor: "grey",
              padding: width / 70,
              borderRadius: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Quantum"
              keyboardType="numeric"
              editable={lockti}
              style={{ height: height / 17, fontSize: width / 24 }}
              maxLength={4}
              onChangeText={(val) => {}}
            />
          </View>
        </View>
        <FlatList
          style={{ height: height / 2.6 }}
          data={dataObjectrr}
          scrollEnabled={true}
          renderItem={({ item }) => {
            return (
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    marginTop: width / 30,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: width / 24 }}>
                      PID : {item.id}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: width / 6.5,
                      height: height / 21,
                      borderWidth: 0.25,
                      borderColor: "grey",
                      padding: width / 70,
                      borderRadius: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder="AT"
                      keyboardType="numeric"
                      style={{ height: height / 17, fontSize: width / 24 }}
                      maxLength={4}
                      onChangeText={(val) => {}}
                    />
                  </View>
                  <View
                    style={{
                      width: width / 6.5,
                      height: height / 21,
                      borderWidth: 0.25,
                      borderColor: "grey",
                      padding: width / 70,
                      borderRadius: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder="BT"
                      keyboardType="numeric"
                      style={{ height: height / 17, fontSize: width / 24 }}
                      maxLength={4}
                      onChangeText={(val) => {}}
                    />
                  </View>
                  <View
                    style={{
                      width: width / 6.5,
                      height: height / 21,
                      borderWidth: 0.25,
                      borderColor: "grey",
                      padding: width / 70,
                      borderRadius: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder="Priority"
                      keyboardType="numeric"
                      style={{ height: height / 17, fontSize: width / 24 }}
                      maxLength={4}
                      onChangeText={(val) => {}}
                    />
                  </View>
                </View>
              </ScrollView>
            );
          }}
        />
      </View>
    );
  };

  const SJFview = () => {
    return (
      <FlatList
        style={{ height: height / 2.6 }}
        data={dataObject}
        scrollEnabled={true}
        renderItem={({ item }) => {
          return (
            <ScrollView>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: width / 30,
                }}
              >
                <View>
                  <Text style={{ fontSize: width / 24 }}>PID : {item.id}</Text>
                </View>
                <View
                  style={{
                    width: width / 4.6,
                    height: height / 17,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="AT"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
                <View
                  style={{
                    width: width / 4.6,
                    height: height / 17,
                    borderWidth: 0.25,
                    borderColor: "grey",
                    padding: width / 70,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    placeholder="BT"
                    keyboardType="numeric"
                    style={{ height: height / 17, fontSize: width / 24 }}
                    maxLength={4}
                    onChangeText={(val) => {}}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  const SRRview = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ fontSize: width / 24 }}>Time Quantum:</Text>

          <View
            style={{
              width: width / 4.6,
              height: height / 17,
              borderWidth: 0.25,
              borderColor: "grey",
              padding: width / 70,
              borderRadius: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Quantum"
              keyboardType="numeric"
              editable={lockti}
              style={{ height: height / 17, fontSize: width / 24 }}
              maxLength={4}
              onChangeText={(val) => {}}
            />
          </View>
        </View>
        <FlatList
          style={{ height: height / 2.6 }}
          data={dataObjectsrr}
          scrollEnabled={true}
          renderItem={({ item }) => {
            return (
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    marginTop: width / 30,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: width / 24 }}>
                      PID : {item.id}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: width / 4.6,
                      height: height / 17,
                      borderWidth: 0.25,
                      borderColor: "grey",
                      padding: width / 70,
                      borderRadius: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder="AT"
                      keyboardType="numeric"
                      style={{ height: height / 17, fontSize: width / 24 }}
                      maxLength={4}
                      onChangeText={(val) => {}}
                    />
                  </View>
                  <View
                    style={{
                      width: width / 4.6,
                      height: height / 17,
                      borderWidth: 0.25,
                      borderColor: "grey",
                      padding: width / 70,
                      borderRadius: 3,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      placeholder="BT"
                      keyboardType="numeric"
                      style={{ height: height / 17, fontSize: width / 24 }}
                      maxLength={4}
                      onChangeText={(val) => {}}
                    />
                  </View>
                </View>
              </ScrollView>
            );
          }}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Select an Algorithm</Text>
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onValueChange(itemValue)}
          >
            <Picker.Item
              label="Shortest Job First (SJF)"
              value="Shortest Job First (SJF)"
            />
            <Picker.Item
              label="First Come First Serve"
              value="First Come First Serve"
            />
            <Picker.Item
              label="Priority Scheduling"
              value="Priority Scheduling"
            />
            <Picker.Item
              label="Round Robin with Priority"
              value="Round Robin with Priority"
            />
            <Picker.Item label="Round Robin" value="Round Robin" />
          </Picker>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton
              value="yes"
              status={custom ? "checked" : "unchecked"}
              onPress={handleRadioButtonPress}
            />
            <Text style={{ fontStyle: "italic" }}>Use Custom Parameter</Text>
          </View>
          {custom && !showfcfs && !showps && !showrr && !showsjf && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: width / 30,
              }}
            >
              <View
                style={{
                  width: width / 4.6,
                  height: height / 17,
                  borderWidth: 0.25,
                  borderColor: "grey",
                  padding: width / 70,
                  borderRadius: 3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  placeholder="# process"
                  keyboardType="numeric"
                  editable={lockti}
                  style={{ height: height / 17, fontSize: width / 24 }}
                  maxLength={4}
                  onChangeText={(val) => {
                    settextinput(val);
                  }}
                />
              </View>
            </View>
          )}
          {value == "First Come First Serve" && custom && showfcfs && (
            <FCFSview />
          )}
          {value == "Shortest Job First (SJF)" && custom && showsjf && (
            <SJFview />
          )}
          {value == "Priority Scheduling" && custom && showps && <PSview />}
          {value == "Round Robin with Priority" && custom && showrr && (
            <RRview />
          )}
          {value == "Round Robin" && custom && showsrr && <SRRview />}
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                handleNumofProcesses(textinput);
              }}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: width * 0.05,
    borderRadius: width * 0.05,
  },

  modalText: {
    marginBottom: width * 0.05,
    fontSize: width * 0.05,
  },
  radioButtonContainer: {},
  radioLabel: {
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    fontStyle: "italic",
  },
  closeButton: {
    marginTop: width * 0.05,
    paddingHorizontal: width * 0.1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    height: height / 18,
    borderRadius: width * 0.01,
  },
  closeButtonText: {
    color: "white",
    fontSize: width * 0.04,
  },
});

export default SelectionModal;
