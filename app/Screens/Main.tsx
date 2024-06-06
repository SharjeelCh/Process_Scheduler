import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import SelectionModal from "../Components/SelectionModal";
import { height, width } from "../Components/Dimensions";
import { ActivityIndicator } from "react-native-paper";
import * as mediaLibrary from "expo-media-library";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { captureRef } from "react-native-view-shot";
import DownloadModal from "../Components/DownloadModal";
import Alert from "../Components/Alert";
import { Line, Svg } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const Main = () => {
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [algorithm, setAlgorithm] = useState("");
  const [processes, setProcesses] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [timeQuantum, setTimeQuantum] = useState(0);
  const [showdownloadModal, setshowdownloadModal] = useState(false);
  const [showAlert, setshowAlert] = useState(false);

  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const viewRef = useRef(null);
  const viewRef2 = useRef(null);

  const captureView = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const uri = await captureRef(viewRef, {
        format: "jpg",
        quality: 1,
      });

      const asset = await mediaLibrary.createAssetAsync(uri);
      await mediaLibrary.saveToLibraryAsync(asset.uri);

      setshowdownloadModal(true);

      return uri;
    } catch (error) {
      console.error("Error capturing view:", error);
    }
  };

  const handleGeneratePDF = async () => {
    await captureView();
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    router.push("/Screens/Main");
    wait(400).then(() => setRefreshing(false));
  });

  const handleValueChange = (value) => {
    setAlgorithm(value);
  };

  const handleModalClose = () => {
    setVisible(false);
  };

  const calculateWaitingTime = (processes, ganttChart) => {
    let waitingTimes = {};
    processes.forEach((process) => {
      let endTime = ganttChart
        .filter((entry) => entry.id === process.id)
        .pop().endTime;
      waitingTimes[process.id] =
        endTime - process.arrivalTime - process.burstTime;
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

  const srtfAlgorithm = (originalProcesses) => {
    let currentTime = 0;
    let ganttChart = [];
    let processQueue = [];
    let processes = deepCopyProcesses(originalProcesses);

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processes.length > 0 || processQueue.length > 0) {
      while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
        processQueue.push(processes.shift());
      }

      processQueue.sort((a, b) => a.burstTime - b.burstTime);

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

    let ganttChart = [];

    if (algorithm !== "") {
      await delay(950);

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
      } else if (algorithm === "Shortest Remaining Time First") {
        ganttChart = srtfAlgorithm(processes);
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
      await delay(950);
      setshowAlert(true);
      setShow(false);
    }
  };

  const DiagonalLines = ({ width, height }) => {
    const numberOfLines = Math.ceil(width);
    const lines = [];

    for (let i = 0; i < numberOfLines; i++) {
      const x1 = (i + 1) * 10;
      const y1 = 0;
      const x2 = 0;
      const y2 = (i + 1) * 10;
      lines.push(
        <Line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="black"
          strokeWidth="0.46"
        />
      );
    }

    return (
      <Svg
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        style={styles.overlay}
      >
        {lines}
      </Svg>
    );
  };

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{ justifyContent: "center", flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    >
      <StatusBar style="auto" backgroundColor="white" />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={styles.maintext}>Process Scheduler</Text>
        <Text
          style={{
            fontSize: width / 26,
            marginVertical: width / 40,
            fontStyle: "italic",
          }}
        >
          {algorithm}
        </Text>
        {ganttData.length > 0 && (
          <Text
            style={{
              fontSize: width / 22,
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Gantt Chart
          </Text>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ganttContainer}
          ref={viewRef2}
        >
          {ganttData.map((process, index) => {
            const width = (process.endTime - process.startTime) * 33; // Adjust scale as needed
            return (
              <View key={index}>
                <View
                  style={{
                    ...styles.process,
                    width: width,
                    backgroundColor:
                      process.id === "wait"
                        ? "#ccc"
                        : `hsl(${process.id * 50}, 80%, 50%)`,
                  }}
                >
                  {process.id === "wait" && (
                    <DiagonalLines width={width} height={height / 14} />
                  )}
                  <Text style={styles.processText}>
                    {process.id === "wait" ? "Wait" : `P${process.id}`}
                  </Text>
                </View>
                <View
                  style={{
                    ...styles.processtime,
                    width: width,
                  }}
                >
                  <Text style={styles.processText2}>
                    {`${process.startTime}`}
                  </Text>
                  <Text
                    style={styles.processText2}
                  >{`${process.endTime}`}</Text>
                </View>
              </View>
            );
          })}
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
            setProcessesssrtf={setProcesses}
          />
        </View>

        {tableData && (
          <ScrollView
            ref={viewRef}
            style={styles.tableContainer}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: height / 40,
              }}
            >
              <Text style={styles.tableHeader}>Process Table</Text>
              <TouchableOpacity
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 100,
                  backgroundColor: "rgba(255, 0, 0, 0.7)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleGeneratePDF}
              >
                <LinearGradient
                  colors={["#ff0066", "#E3A14F"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                  }}
                />
                <Icon name="download" size={20} color={"white"} />
              </TouchableOpacity>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Process ID</Text>
                <Text style={styles.tableCell}>Arrival Time</Text>
                <Text style={styles.tableCell}>Burst Time</Text>
                <Text style={styles.tableCell}>Priority</Text>

                <Text style={styles.tableCell}>Waiting Time</Text>
                <Text style={styles.tableCell}>Turnaround Time</Text>
              </View>
              {tableData.processes.map((process) => (
                <View style={styles.tableRow} key={process.id}>
                  <Text style={styles.tableCell}>{process.id}</Text>
                  <Text style={styles.tableCell}>{process.arrivalTime}</Text>
                  <Text style={styles.tableCell}>{process.burstTime}</Text>
                  <Text style={styles.tableCell}>{process.priority}</Text>
                  <Text style={styles.tableCell}>{process.waitingTime}</Text>
                  <Text style={styles.tableCell}>{process.turnaroundTime}</Text>
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
            marginBottom: height / 50,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setVisible(true);
            }}
            style={styles.algoButton}
          >
            <LinearGradient
              colors={["#ACA5D0", "#5140B3"]} // Define your gradient colors here
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradient}
            />
            <Text
              style={{
                color: "white",
                fontSize: width / 23,
                fontWeight: "700",
              }}
            >
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
              <LinearGradient
                colors={["#ACA5D0", "#5140B3"]} // Define your gradient colors here
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradient}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: width / 23,
                  fontWeight: "700",
                }}
              >
                Calculate
              </Text>
            </TouchableOpacity>
          )}
          <Alert
            showmodal={showdownloadModal}
            setshowmodal={setshowdownloadModal}
            closemodal={false}
            icon={"check-circle"}
            text={"Image Saved to Gallery"}
          />
          <Alert
            showmodal={showAlert}
            setshowmodal={setshowAlert}
            closemodal={false}
            icon={"exclamation-triangle"}
            text={"No Algorithm Selected!"}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  maintext: {
    fontSize: width / 14.5,
    fontWeight: "bold",
    fontFamily: "Roboto",
    marginTop: height / 40,
  },
  gradient: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    width: width / 2.7,
    height: height / 15,
    position: "absolute",
  },
  gradient2: {
    alignItems: "center",
    width: width,
    height: height,
    position: "absolute",
  },
  overlay: {
    position: "absolute",
  },
  algoButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: width / 2.7,
    borderRadius: width / 40,
    height: height / 16,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
  },
  ganttContainer: {
    flexDirection: "row",
    marginTop: width / 35,
    height: height / 15,
  },
  process: {
    height: height / 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.3,
    borderColor: "rgba(0,0,0,0.25)",
  },
  processtime: {
    height: height / 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: "rgba(0,0,0,1)",
    borderBottomColor: "rgba(0,0,0,1)",
    marginTop: height * 0.003,
  },
  processText: {
    color: "white",
    fontWeight: "bold",
  },
  processText2: {
    color: "black",
    fontWeight: "500",
    fontSize: width / 30,
  },
  tableContainer: {
    marginTop: 20,
    width: "100%",
    height: height / 2.5,
    backgroundColor: "white",
    marginBottom: height / 20,
  },

  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
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
