"use client";
import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Calendar, 
  Users, 
  FileText, 
  Clock, 
  BellRing, 
  Settings, 
  LogOut, 
  User, 
  Search,
  Menu,
  X,
  ChevronRight,
  Home,
  BarChart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
// import { useDoctorAuth } from "@/context/DoctorAuthContext";

function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
//   const [upcomingAppointments, setUpcomingAppointments] = useState([]);
//   const [recentPatients, setRecentPatients] = useState([]);
  const router = useRouter();
//   const { doctor, logout } = useDoctorAuth();

  useEffect(() => {
    // Fetch doctor data, appointments, and patients
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // These would be actual API calls in a real application
        // const appointmentsResponse = await fetchDoctorAppointments(doctor.id);
        // const patientsResponse = await fetchRecentPatients(doctor.id);
        
        // Mock data for demo purposes
        // setUpcomingAppointments([
        //   { id: 1, patientName: "John Smith", time: "09:00 AM", date: "2025-04-26", type: "Check-up", status: "confirmed" },
        //   { id: 2, patientName: "Emily Johnson", time: "10:30 AM", date: "2025-04-26", type: "Follow-up", status: "confirmed" },
        //   { id: 3, patientName: "Michael Brown", time: "02:15 PM", date: "2025-04-26", type: "Consultation", status: "pending" },
        //   { id: 4, patientName: "Sarah Williams", time: "04:00 PM", date: "2025-04-27", type: "Check-up", status: "confirmed" },
        // ]);
        
        // setRecentPatients([
        //   { id: 101, name: "John Smith", age: 45, lastVisit: "2025-04-20", condition: "Hypertension" },
        //   { id: 102, name: "Emily Johnson", age: 32, lastVisit: "2025-04-18", condition: "Diabetes Type 2" },
        //   { id: 103, name: "Michael Brown", age: 28, lastVisit: "2025-04-15", condition: "Asthma" },
        //   { id: 104, name: "Sarah Williams", age: 54, lastVisit: "2025-04-12", condition: "Arthritis" },
        // ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
    //   await logout();
      router.push("/login/doctor");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <h1>doctor dashboard</h1>
  )
}

export default DoctorDashboard;