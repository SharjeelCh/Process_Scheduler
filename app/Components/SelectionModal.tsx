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
import { RadioButton, Checkbox } from "react-native-paper";
import Alert from "./Alert";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const SelectionModal = ({
  visible,
  value,
  onValueChange,
  onClose,
  setCustom,
  custom,
  setProcesses,
  setProcessessjf,
  setProcessessps,
  setProcessesssrr,
  settimequantumssrr,
  setProcessessrr,
  setProcessesssrtf,
}) => {
  const [textinput, settextinput] = useState("");
  const [lockti, setlockti] = useState(true);
  const [showfcfs, setshowfcfs] = useState(false);
  const [showsjf, setshowsjf] = useState(false);
  const [showps, setshowps] = useState(false);
  const [showrr, setshowrr] = useState(false);
  const [showsrr, setshowsrr] = useState(false);
  const [showsrtf, setshowsrtf] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [dataObjectps, setDataObjectps] = useState(null);
  const [dataObjectrr, setDataObjectrr] = useState(null);
  const [dataObjectsrr, setDataObjectsrr] = useState(null);
  const [showclose, setshowclose] = useState(false);
  const [timeQuantum, setTimeQuantum] = useState(0);
  const [showdownloadModal, setshowdownloadModal] = useState(false);

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
      arr.push({ id: i, arrivalTime: "", burstTime: "" });
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
      arr.push({ id: i, arrivalTime: "", burstTime: "", priority: "" });
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
      arr.push({ id: i, arrivalTime: "", burstTime: "", tq: "", priority: "" });
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
      arr.push({ id: i, arrivalTime: "", burstTime: "", tq: "" });
    }
    setDataObjectsrr(arr);
  };

  const handleNumofProcesses = (num: any) => {
    if (!num) {
      setshowdownloadModal(true);
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
      } else if (value == "Shortest Remaining Time First") {
        setlockti(false);
        handleCreateObject();
        setshowsrtf(true);
        console.log("srtf");
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

  const updateArrivalTime = (id, value) => {
    const newDataObject = dataObject.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          arrivalTime: isNaN(value) ? item.arrivalTime : parseInt(value),
        };
      }
      return item;
    });
    setDataObject(newDataObject);
    setProcesses(newDataObject);
  };

  const updateBurstTime = (id, value) => {
    const newDataObject = dataObject.map((item) => {
      if (item.id === id) {
        return { ...item, burstTime: parseInt(value) };
      }
      return item;
    });
    setDataObject(newDataObject);
    setProcesses(newDataObject);
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
                    value={item.arrivalTime?.toString()}
                    onChangeText={(val) => updateArrivalTime(item.id, val)}
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
                    value={item.burstTime?.toString()}
                    onChangeText={(val) => updateBurstTime(item.id, val)}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  useEffect(() => {
    console.log(dataObject);
  }, [dataObject]);

  const updateArrivalTimeps = (id, value) => {
    const newDataObject = dataObjectps.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          arrivalTime: isNaN(value) ? item.arrivalTime : parseInt(value),
        };
      }
      return item;
    });
    setDataObjectps(newDataObject);
    setProcessessps(newDataObject);
  };

  const updateBurstTimeps = (id, value) => {
    const newDataObject = dataObjectps.map((item) => {
      if (item.id === id) {
        return { ...item, burstTime: parseInt(value) };
      }
      return item;
    });
    setDataObjectps(newDataObject);
    setProcessessps(newDataObject);
  };
  const updatePriotityps = (id, value) => {
    const newDataObject = dataObjectps.map((item) => {
      if (item.id === id) {
        return { ...item, priority: parseInt(value) };
      }
      return item;
    });
    setDataObjectps(newDataObject);
    setProcessessps(newDataObject);
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
                    value={item.arrivalTime?.toString()}
                    onChangeText={(val) => updateArrivalTimeps(item.id, val)}
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
                    value={item.burstTime?.toString()}
                    onChangeText={(val) => updateBurstTimeps(item.id, val)}
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
                    value={item.priority?.toString()}
                    onChangeText={(val) => updatePriotityps(item.id, val)}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  const updateArrivalTimerr = (id, value) => {
    const newDataObject = dataObjectrr.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          arrivalTime: isNaN(value) ? item.arrivalTime : parseInt(value),
        };
      }
      return item;
    });
    setDataObjectrr(newDataObject);
    setProcessessrr(newDataObject);
  };

  const updateBurstTimerr = (id, value) => {
    const newDataObject = dataObjectrr.map((item) => {
      if (item.id === id) {
        return { ...item, burstTime: parseInt(value) };
      }
      return item;
    });
    setDataObjectrr(newDataObject);
    setProcessessrr(newDataObject);
  };
  const updatePriotityrr = (id, value) => {
    const newDataObject = dataObjectrr.map((item) => {
      if (item.id === id) {
        return { ...item, priority: parseInt(value) };
      }
      return item;
    });
    setDataObjectrr(newDataObject);
    setProcessessrr(newDataObject);
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
              editable={true}
              style={{ height: height / 17, fontSize: width / 24 }}
              maxLength={4}
              value={timeQuantum?.toString()}
              onChangeText={(val) => {
                setTimeQuantum(val);
                settimequantumssrr(parseInt(val));
                const newDataObject = dataObjectrr.map((item) => {
                  return { ...item, tq: parseInt(val) };
                });
                setDataObjectsrr(newDataObject);
                setProcessesssrr(newDataObject);
              }}
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
                      value={item.arrivalTime?.toString()}
                      onChangeText={(val) => updateArrivalTimerr(item.id, val)}
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
                      value={item.burstTime?.toString()}
                      onChangeText={(val) => updateBurstTimerr(item.id, val)}
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
                      value={item.priority?.toString()}
                      onChangeText={(val) => updatePriotityrr(item.id, val)}
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

  const updateArrivalTimesjf = (id, value) => {
    const newDataObject = dataObject.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          arrivalTime: isNaN(value) ? item.arrivalTime : parseInt(value),
        };
      }
      return item;
    });
    setDataObject(newDataObject);
    setProcessessjf(newDataObject);
  };

  const updateBurstTimesjf = (id, value) => {
    const newDataObject = dataObject.map((item) => {
      if (item.id === id) {
        return { ...item, burstTime: parseInt(value) };
      }
      return item;
    });
    setDataObject(newDataObject);
    setProcessessjf(newDataObject);
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
                    value={item.arrivalTime?.toString()}
                    onChangeText={(val) => updateArrivalTimesjf(item.id, val)}
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
                    value={item.burstTime?.toString()}
                    onChangeText={(val) => {
                      updateBurstTimesjf(item.id, val);
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  const updateArrivalTimessrtf = (id, value) => {
    const newDataObject = dataObject.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          arrivalTime: isNaN(value) ? item.arrivalTime : parseInt(value),
        };
      }
      return item;
    });
    setDataObject(newDataObject);
    setProcessesssrtf(newDataObject);
  };

  const updateBurstTimessrtf = (id, value) => {
    const newDataObject = dataObject.map((item) => {
      if (item.id === id) {
        return { ...item, burstTime: parseInt(value) };
      }
      return item;
    });
    setDataObject(newDataObject);
    setProcessesssrtf(newDataObject);
  };

  const SRTFview = () => {
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
                    value={item.arrivalTime?.toString()}
                    onChangeText={(val) => updateArrivalTimessrtf(item.id, val)}
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
                    value={item.burstTime?.toString()}
                    onChangeText={(val) => {
                      updateBurstTimessrtf(item.id, val);
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          );
        }}
      />
    );
  };

  const updateArrivalTimessrr = (id, value) => {
    const newDataObject = dataObjectsrr.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          arrivalTime: isNaN(value) ? item.arrivalTime : parseInt(value),
        };
      }
      return item;
    });
    setDataObjectsrr(newDataObject);
    setProcessesssrr(newDataObject);
  };

  const updateBurstTimessrr = (id, value) => {
    const newDataObject = dataObjectsrr.map((item) => {
      if (item.id === id) {
        return { ...item, burstTime: parseInt(value) };
      }
      return item;
    });
    setDataObjectsrr(newDataObject);
    setProcessesssrr(newDataObject);
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
              style={{ height: height / 17, fontSize: width / 24 }}
              maxLength={4}
              value={timeQuantum?.toString()}
              onChangeText={(val) => {
                setTimeQuantum(val);
                settimequantumssrr(parseInt(val));
                const newDataObject = dataObjectsrr.map((item) => {
                  return { ...item, tq: parseInt(val) };
                });
                setDataObjectsrr(newDataObject);
                setProcessesssrr(newDataObject);
              }}
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
                      value={item.arrivalTime?.toString()}
                      onChangeText={(val) => {
                        updateArrivalTimessrr(item.id, val);
                      }}
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
                      value={item.burstTime?.toString()}
                      onChangeText={(val) => {
                        updateBurstTimessrr(item.id, val);
                      }}
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
    <Modal visible={visible} animationType="fade" transparent={true}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
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
              label="Shortest Remaining Time First"
              value="Shortest Remaining Time First"
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
              <Text style={{ fontSize: width / 24 }}>Processes:{"\t\t"}</Text>
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
          {value == "Shortest Remaining Time First" && custom && showsrtf && (
            <SRTFview />
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
              <LinearGradient
                colors={['#ff0066', '#E3A14F']}// Define your gradient colors here
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              />
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <LinearGradient
                colors={['#ff0066', '#E3A14F']} // Define your gradient colors here
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              />
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Alert
        showmodal={showdownloadModal}
        setshowmodal={setshowdownloadModal}
        closemodal={false}
        icon={"exclamation-triangle"}
        text={"processes cannot be empty"}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradient: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    width: 120,
    height: 100,
    position: "absolute",
  },
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
    backgroundColor: "#F1F0EC",
    alignItems: "center",
    justifyContent: "center",
    height: height / 18,
    borderRadius: width * 0.01,
    elevation: 5,
    overflow: "hidden",
  },
  closeButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight:'700'
  },
});

export default SelectionModal;
