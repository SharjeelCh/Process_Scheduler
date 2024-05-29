import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet } from "react-native";
import SelectionModal from "../Components/SelectionModal";
import { height, width } from "../Components/Dimensions";

const Main = () => {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [processes, setProcesses] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [tableData, setTableData] = useState(null);

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

  const calculateWaitingTime = (processes, ganttChart) => {
    let waitingTimes = {};
    processes.forEach((process) => {
      let processExecution = ganttChart.find((entry) => entry.id === process.id);
      waitingTimes[process.id] = processExecution.startTime - process.arrivalTime;
    });
    return waitingTimes;
  };

  const calculateTurnaroundTime = (processes, ganttChart) => {
    let turnaroundTimes = {};
    processes.forEach((process) => {
      let processExecution = ganttChart.find((entry) => entry.id === process.id);
      turnaroundTimes[process.id] = processExecution.endTime - process.arrivalTime;
    });
    return turnaroundTimes;
  };

  const calculateResponseTime = (processes, ganttChart) => {
    let responseTimes = {};
    processes.forEach((process) => {
      let processExecution = ganttChart.find((entry) => entry.id === process.id);
      responseTimes[process.id] = processExecution.startTime - process.arrivalTime;
    });
    return responseTimes;
  };

  const fcfsAlgorithm = (processes) => {
    let currentTime = 0;
    let ganttChart = [];

    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    sortedProcesses.forEach((process) => {
      if (currentTime < process.arrivalTime) {
        ganttChart.push({ id: "wait", startTime: currentTime, endTime: process.arrivalTime });
        currentTime = process.arrivalTime;
      }

      let startTime = currentTime;
      let endTime = startTime + process.burstTime;
      ganttChart.push({ ...process, startTime, endTime });
      currentTime = endTime;
    });

    return ganttChart;
  };

  const sjfAlgorithm = (processes) => {
    let currentTime = 0;
    let ganttChart = [];
    let remainingProcesses = [...processes];

    remainingProcesses.sort((a, b) => a.burstTime - b.burstTime);

    while (remainingProcesses.length > 0) {
      let process = remainingProcesses.shift();

      let startTime = currentTime;
      let endTime = startTime + process.burstTime;
      ganttChart.push({ ...process, startTime, endTime });
      currentTime = endTime;
    }

    return ganttChart;
  };

  const calculateGanttData = () => {
    let ganttChart = [];

    if (algorithm === "First Come First Serve") {
      ganttChart = fcfsAlgorithm(processes);
    } else if (algorithm === "Shortest Job First (SJF)") {
      ganttChart = sjfAlgorithm(processes);
    }

    setGanttData(ganttChart);

    const waitingTimes = calculateWaitingTime(processes, ganttChart);
    const turnaroundTimes = calculateTurnaroundTime(processes, ganttChart);
    const responseTimes = calculateResponseTime(processes, ganttChart);
    const totalWaitingTime = Object.values(waitingTimes).reduce((acc, time) => acc + time, 0);
    const avgWaitingTime = totalWaitingTime / processes.length;
    const totalTurnaroundTime = Object.values(turnaroundTimes).reduce((acc, time) => acc + time, 0)/processes.length

    const tableData = processes.map((process) => ({
      id: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      waitingTime: waitingTimes[process.id],
      turnaroundTime: turnaroundTimes[process.id],
      responseTime: responseTimes[process.id],
    }));

    setTableData({
      processes: tableData,
      avgWaitingTime,
      totalTurnaroundTime,
    });
  };

  useEffect(() => {
    console.log("Gantt data changed to", processes);
  }, [processes]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.ganttContainer}>
        {ganttData.map((process, index) => (
          <View>
          <View
            key={index}
            style={{
              ...styles.process,
              width: (process.endTime - process.startTime) * 20, // Adjust scale as needed
              backgroundColor: process.id === "wait" ? "#ccc" : `hsl(${process.id * 50}, 70%, 50%)`,
            }}
          >
            <Text style={styles.processText}>
              {process.id === "wait" ? `Wait (${process.startTime}-${process.endTime})` : `P${process.id} (${process.startTime}-${process.endTime})`}
            </Text>
          </View>
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
          setProcessessjf={setProcesses}
        />
        <Button title="Calculate Gantt Chart" onPress={calculateGanttData} />
      </View>

      {tableData && (
        <ScrollView style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Process Table</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Process ID</Text>
              <Text style={styles.tableCell}>Arrival Time</Text>
              <Text style={styles.tableCell}>Burst Time</Text>
              <Text style={styles.tableCell}>Waiting Time</Text>
              <Text style={styles.tableCell}>Turnaround Time</Text>
              <Text style={styles.tableCell}>Response Time</Text>
            </View>
            {tableData.processes.map((process) => (
              <View style={styles.tableRow} key={process.id}>
                <Text style={styles.tableCell}>{process.id}</Text>
                <Text style={styles.tableCell}>{process.arrivalTime}</Text>
                <Text style={styles.tableCell}>{process.burstTime}</Text>
                <Text style={styles.tableCell}>{process.waitingTime}</Text>
                <Text style={styles.tableCell}>{process.turnaroundTime}</Text>
                <Text style={styles.tableCell}>{process.responseTime}</Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Average Waiting Time:</Text>
              <Text style={styles.tableCell}>{tableData.avgWaitingTime.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Avg Turnaround Time:</Text>
              <Text style={styles.tableCell}>{tableData.totalTurnaroundTime}</Text>
            </View>
          </View>
        </ScrollView>
      )}
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
    height: height/13,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    borderWidth:1.5,
    borderColor:'grey',
  },
  processText: {
    color: "#fff",
  },
  tableContainer: {
    marginTop: 20,
    width: "100%",
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
});

export default Main;
