import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import SelectionModal from "../Components/SelectionModal";

const Main = () => {
  const [visible, setVisible] = useState(false);
  const [custom, setcustom] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const handleValueChange = (value) => {
    setAlgorithm(value);
  };

  useEffect(() => {
    console.log("Algorithm changed to", algorithm);
    console.log("Custom parameter is", custom);
  }, [algorithm]);
  const handleModalClose = () => {
    setVisible(false);
  };

  const [processes, setProcesses] = useState([
    { id: 1, arrivalTime: 0, burstTime: 5 },
    { id: 2, arrivalTime: 1, burstTime: 3 },
    { id: 3, arrivalTime: 2, burstTime: 8 },
    { id: 4, arrivalTime: 3, burstTime: 6 },
  ]);
  const [ganttData, setGanttData] = useState([]);

  const calculateGanttData = () => {
    let currentTime = 0;
    let ganttChart = [];

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    processes.forEach((process) => {
      let startTime = Math.max(currentTime, process.arrivalTime);
      let endTime = startTime + process.burstTime;
      ganttChart.push({ ...process, startTime, endTime });
      currentTime = endTime;
    });

    setGanttData(ganttChart);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.ganttContainer}>
        {ganttData.map((process) => (
          <View
            key={process.id}
            style={{
              ...styles.process,
              width: (process.endTime - process.startTime) * 20, // Adjust scale as needed
              backgroundColor: `hsl(${process.id * 50}, 70%, 50%)`,
            }}
          >
            <Text style={styles.processText}>
              P{process.id} ({process.startTime}-{process.endTime})
            </Text>
          </View>
        ))}
      </ScrollView>

      <View>
        <Text>{algorithm}</Text>
        <Button
          title="Select an Algorithm"
          onPress={() => {
            setVisible(true);
          }}
        />
        <SelectionModal
          visible={visible}
          value={algorithm}
          setCustom={setcustom}
          onValueChange={handleValueChange}
          onClose={handleModalClose}
          custom={custom}
        />
        <Button title="Calculate Gantt Chart" onPress={calculateGanttData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  ganttContainer: {
    flexDirection: "row",
    marginTop: 20,
    padding: 10,
  },
  process: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  processText: {
    color: "#fff",
  },
});

export default Main;
