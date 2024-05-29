import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SelectionModal from "../Components/SelectionModal";
import { height, width } from "../Components/Dimensions";
import { ActivityIndicator } from "react-native-paper";
import * as font from "expo-font";

const Main = () => {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [processes, setProcesses] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [timeQuantum, setTimeQuantum] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log("Algorithm changed to", algorithm);
    console.log("Custom parameter is", custom);
    console.log("time quantum is", timeQuantum);
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
      let startTime = ganttChart.find(
        (entry) => entry.id === process.id
      ).startTime;
      waitingTimes[process.id] = startTime - process.arrivalTime;
    });
    return waitingTimes;
  };

  const calculateTurnaroundTime = (processes, ganttChart) => {
    let turnaroundTimes = {};
    processes.forEach((process) => {
      let endTime = ganttChart
        .filter((entry) => entry.id === process.id)
        .pop().endTime;
      turnaroundTimes[process.id] = endTime - process.arrivalTime;
    });
    return turnaroundTimes;
  };

  const calculateResponseTime = (processes, ganttChart) => {
    let responseTimes = {};
    processes.forEach((process) => {
      let startTime = ganttChart.find(
        (entry) => entry.id === process.id
      ).startTime;
      responseTimes[process.id] = startTime - process.arrivalTime;
    });
    return responseTimes;
  };

  const deepCopyProcesses = (processes) => {
    return processes.map((process) => ({ ...process }));
  };

  const fcfsAlgorithm = (originalProcesses) => {
    let currentTime = 0;
    let ganttChart = [];
    let processes = deepCopyProcesses(originalProcesses);

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    processes.forEach((process) => {
      if (currentTime < process.arrivalTime) {
        ganttChart.push({
          id: "wait",
          startTime: currentTime,
          endTime: process.arrivalTime,
        });
        currentTime = process.arrivalTime;
      }

      let startTime = currentTime;
      let endTime = startTime + process.burstTime;
      ganttChart.push({ ...process, startTime, endTime });
      currentTime = endTime;
    });

    return ganttChart;
  };

  const sjfAlgorithm = (originalProcesses) => {
    let currentTime = 0;
    let ganttChart = [];
    let processes = deepCopyProcesses(originalProcesses);

    processes.sort((a, b) => a.burstTime - b.burstTime);

    while (processes.length > 0) {
      let process = processes.shift();

      let startTime = currentTime;
      let endTime = startTime + process.burstTime;
      ganttChart.push({ ...process, startTime, endTime });
      currentTime = endTime;
    }

    return ganttChart;
  };

  const priorityAlgorithm = (originalProcesses) => {
    let currentTime = 0;
    let ganttChart = [];
    let processQueue = [];
    let processes = deepCopyProcesses(originalProcesses);

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length > 0 || processQueue.length > 0) {
      while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
        processQueue.push(processes.shift());
      }

      processQueue.sort((a, b) => a.priority - b.priority);

      if (processQueue.length > 0) {
        let currentProcess = processQueue.shift();

        let nextArrivalTime =
          processes.length > 0 ? processes[0].arrivalTime : Number.MAX_VALUE;
        let runTime = Math.min(
          currentProcess.burstTime,
          nextArrivalTime - currentTime
        );

        ganttChart.push({
          id: currentProcess.id,
          startTime: currentTime,
          endTime: currentTime + runTime,
        });

        currentProcess.burstTime -= runTime;
        currentTime += runTime;

        if (currentProcess.burstTime > 0) {
          processQueue.push(currentProcess);
        }
      } else {
        ganttChart.push({
          id: "wait",
          startTime: currentTime,
          endTime: processes[0].arrivalTime,
        });
        currentTime = processes[0].arrivalTime;
      }
    }

    return ganttChart;
  };

  const roundRobinAlgorithm = (originalProcesses, timeQuantum) => {
    let currentTime = 0;
    let ganttChart = [];
    let processQueue = [];
    let processes = deepCopyProcesses(originalProcesses);

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length > 0 || processQueue.length > 0) {
      while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
        processQueue.push(processes.shift());
      }

      if (processQueue.length > 0) {
        let currentProcess = processQueue.shift();

        let runTime = Math.min(currentProcess.burstTime, timeQuantum);
        ganttChart.push({
          id: currentProcess.id,
          startTime: currentTime,
          endTime: currentTime + runTime,
        });

        currentProcess.burstTime -= runTime;
        currentTime += runTime;

        while (
          processes.length > 0 &&
          processes[0].arrivalTime <= currentTime
        ) {
          processQueue.push(processes.shift());
        }

        if (currentProcess.burstTime > 0) {
          processQueue.push(currentProcess);
        }
      } else {
        let nextArrivalTime =
          processes.length > 0 ? processes[0].arrivalTime : currentTime;
        ganttChart.push({
          id: "wait",
          startTime: currentTime,
          endTime: nextArrivalTime,
        });
        currentTime = nextArrivalTime;
      }
    }

    return ganttChart;
  };
  const roundRobinWithPriorityAlgorithm = (originalProcesses, timeQuantum) => {
    let currentTime = 0;
    let ganttChart = [];
    let processQueue = [];
    let processes = deepCopyProcesses(originalProcesses);

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length > 0 || processQueue.length > 0) {
      while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
        processQueue.push(processes.shift());
      }

      processQueue.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.arrivalTime - b.arrivalTime;
        }
        return a.priority - b.priority;
      });

      if (processQueue.length > 0) {
        let currentProcess = processQueue.shift();

        let runTime = Math.min(currentProcess.burstTime, timeQuantum);
        ganttChart.push({
          id: currentProcess.id,
          startTime: currentTime,
          endTime: currentTime + runTime,
        });

        currentProcess.burstTime -= runTime;
        currentTime += runTime;

        while (
          processes.length > 0 &&
          processes[0].arrivalTime <= currentTime
        ) {
          processQueue.push(processes.shift());
        }

        if (currentProcess.burstTime > 0) {
          processQueue.push(currentProcess);
        }
      } else {
        let nextArrivalTime =
          processes.length > 0 ? processes[0].arrivalTime : currentTime;
        ganttChart.push({
          id: "wait",
          startTime: currentTime,
          endTime: nextArrivalTime,
        });
        currentTime = nextArrivalTime;
      }
    }

    return ganttChart;
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const calculateGanttData = async () => {
    setShow(true);

    console.log(processes);
    let ganttChart = [];

    if (algorithm !== "") {
      await delay(1200);

      if (algorithm === "First Come First Serve") {
        ganttChart = fcfsAlgorithm(processes);
      } else if (algorithm === "Shortest Job First (SJF)") {
        ganttChart = sjfAlgorithm(processes);
      } else if (algorithm === "Priority Scheduling") {
        ganttChart = priorityAlgorithm(processes);
      } else if (algorithm === "Round Robin") {
        ganttChart = roundRobinAlgorithm(processes, timeQuantum);
      } else if (algorithm === "Round Robin with Priority") {
        ganttChart = roundRobinWithPriorityAlgorithm(processes, timeQuantum);
      }

      setGanttData(ganttChart);

      const waitingTimes = calculateWaitingTime(processes, ganttChart);
      const turnaroundTimes = calculateTurnaroundTime(processes, ganttChart);
      const responseTimes = calculateResponseTime(processes, ganttChart);
      const totalWaitingTime = Object.values(waitingTimes).reduce(
        (acc, time) => acc + time,
        0
      );
      const avgWaitingTime = totalWaitingTime / processes.length;
      const totalTurnaroundTime =
        Object.values(turnaroundTimes).reduce((acc, time) => acc + time, 0) /
        processes.length;

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

      setShow(false);
    } else {
      await delay(1200);
      alert("Please select an algorithm");
      setShow(false);
    }
  };

  useEffect(() => {
    console.log("Gantt data changed to", processes);
  }, [processes]);

  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>Process Scheduler</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.ganttContainer}
      >
        {ganttData.map((process, index) => (
          <View key={index}>
            <View
              style={{
                ...styles.process,
                width: (process.endTime - process.startTime) * 35, // Adjust scale as needed
                backgroundColor:
                  process.id === "wait"
                    ? "#ccc"
                    : `hsl(${process.id * 50}, 63%, 46%)`,
              }}
            >
              <Text style={styles.processText}>
                {process.id === "wait"
                  ? `Wait (${process.startTime}-${process.endTime})`
                  : `P${process.id} (${process.startTime}-${process.endTime})`}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View>
        <SelectionModal
          visible={visible}
          value={algorithm}
          setCustom={setCustom}
          onValueChange={handleValueChange}
          onClose={handleModalClose}
          custom={custom}
          setProcesses={setProcesses}
          setProcessessjf={setProcesses}
          setProcessessps={setProcesses}
          setProcessesssrr={setProcesses}
          settimequantumssrr={setTimeQuantum}
          setProcessessrr={setProcesses}
        />
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
              <Text style={styles.tableCell}>
                {tableData.avgWaitingTime.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Avg Turnaround Time:</Text>
              <Text style={styles.tableCell}>
                {tableData.totalTurnaroundTime}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <Text>{algorithm}</Text>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
          style={styles.algoButton}
        >
          <Text style={{ color: "white", fontSize: width / 23 }}>
            Select Algorithm
          </Text>
        </TouchableOpacity>
        {show ? (
          <ActivityIndicator
            animating={show}
            color="red"
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: width / 2.7,
              borderRadius: width / 40,
              height: height / 16,
            }}
          />
        ) : (
          <TouchableOpacity
            style={styles.algoButton}
            onPress={calculateGanttData}
          >
            <Text style={{ color: "white", fontSize: width / 23 }}>
              Calculate
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maintext:{
    fontSize: width / 14.5,
    fontWeight: "bold",
    fontFamily: 'Roboto',
    marginTop: height / 40,
  },
  algoButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: width / 2.7,
    borderRadius: width / 40,
    height: height / 16,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  ganttContainer: {
    flexDirection: "row",
    marginTop: 20,
    padding: 10,
  },
  process: {
    height: height / 13,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    borderWidth: 1.3,
    borderColor: "rgba(0,0,0,0.25)",
  },
  processText: {
    color: "white",
    fontWeight: "500",
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
