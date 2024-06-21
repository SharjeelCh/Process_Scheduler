// AboutMeScreen.js
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { width } from "../Components/Dimensions";
import { router } from "expo-router";

export default function About() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor="#ECF0F1" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{router.back()}}>
            <MaterialIcons name="arrow-back" size={28} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.title}>About</Text>
          <View style={{width:28}}></View>
        </View>
        <Card style={styles.card}>
          <Text style={styles.paragraph}>
            Welcome to our Process Scheduler App! This app allows you to apply
            multiple scheduling algorithms and visualize the results with Gantt
            charts and tables.
          </Text>
          <Text style={styles.paragraph}>
            You can view detailed information including starting times, ending
            times, waiting times, average waiting times, and turnaround times.
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.subtitle}>Algorithms Supported:</Text>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>First-Come, First-Served (FCFS)</Text>
          </View>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>Shortest Job First (SJF)</Text>
          </View>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>
              Shortest Remaining Time First (SRTF)
            </Text>
          </View>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>Priority Scheduling (PS)</Text>
          </View>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>Round Robin (RR)</Text>
          </View>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>Round Robin with Priority</Text>
          </View>
          <View style={styles.listItem}>
            <MaterialIcons name="check-circle" size={20} color="#34495E" />
            <Text style={styles.listText}>
              Multilevel Feedback Queue Scheduling
            </Text>
          </View>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.paragraph}>
            Additionally, you can save your Gantt charts and tables as PDF or
            JPEG for further analysis or reporting.
          </Text>
          <Text style={styles.paragraph}>
            Our app also supports dark mode to reduce eye strain and provide a
            comfortable user experience in low-light environments.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECF0F1",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexDirection: "row",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paragraph: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 10,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  listText: {
    fontSize: 16,
    color: "#34495E",
    marginLeft: 10,
  },
});
