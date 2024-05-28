import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
} from "react-native";
import SelectionModal from "../Components/SelectionModal";

const Main = () => {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [processes, setProcesses] = useState([]);
  const [ganttData, setGanttData] = useState([]);

  useEffect(() => {
    console.log("Algorithm changed to", algorithm);
    console.log("Custom parameter is", custom);
  }, [algorithm]);

  const handleValueChange = (value) => {
    setAlgorithm(value);
  };

  const handleModalClose = () => {
    setVisible(false);
  };

  const calculateGanttData = () => {
    let currentTime = 0;
    let ganttChart = [];

    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    sortedProcesses.forEach((process) => {
      let startTime = Math.max(currentTime, process.arrivalTime);
      let endTime = startTime + process.burstTime;
      ganttChart.push({ ...process, startTime, endTime });
      currentTime = endTime;
    });

    setGanttData(ganttChart);
  };

  useEffect(() => {
    console.log("Gantt data changed to", processes);
  }, [processes]);

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
          setCustom={setCustom}
          onValueChange={handleValueChange}
          onClose={handleModalClose}
          custom={custom}
          setProcesses={setProcesses}
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
