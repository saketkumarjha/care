"use client";

import React, { useState } from "react";
import {
  Heart,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Activity,
  Star,
  User,
  Shield,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useHospitalAuth } from "@/context/HospitalAuthContext";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { hospitalData, isAuthenticated, logout } = useHospitalAuth();

  if (!isAuthenticated || !hospitalData) {
    return <div className="p-4">Loading or not authenticated...</div>;
  }

  const {
    name,
    username,
    hospitalAddress,
    contactNumberOfHospital,
    emailOfHospital,
    licenseNumberOfHospital,
    facilitiesInHospital,
    doctorUnderHospitalID,
    isActive,
    ratingOfHospital,
  } = hospitalData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <span className="font-bold text-xl">MediCare</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-green-700 rounded-full py-1 px-3">
              <span className="text-xs">Hospital Admin</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              {name?.charAt(0) || "H"}
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-gray-600 opacity-75"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg p-4">
              <button onClick={() => setIsSidebarOpen(false)} className="mb-4">
                <X className="h-5 w-5 text-gray-500" />
              </button>
              <nav className="space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-3 p-2 text-gray-900 bg-green-50 rounded-md"
                >
                  <Building2 className="h-5 w-5 text-green-600" />
                  <span>Overview</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Users className="h-5 w-5" />
                  <span>Doctors</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Activity className="h-5 w-5" />
                  <span>Facilities</span>
                </a>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-md w-full mt-4"
                >
                  <span>Log out</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Hospital Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-sm text-gray-500">
                License: {licenseNumberOfHospital}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Doctors</p>
                  <p className="text-2xl font-bold">
                    {(doctorUnderHospitalID?.length || 0)}
                  </p>
                </div>
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Facilities</p>
                  <p className="text-2xl font-bold">
                    {(facilitiesInHospital?.length || 0)}
                  </p>
                </div>
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">
                      {ratingOfHospital}
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (ratingOfHospital ?? 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Hospital Info */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <h2 className="text-lg font-medium mb-4">Hospital Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm">
                    {hospitalAddress?.addressLine1 || "N/A"},{" "}
                    {hospitalAddress?.addressLine2 || "N/A"},{" "}
                    {hospitalAddress?.addressLine3 || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-sm">{contactNumberOfHospital}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm">{emailOfHospital}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Account</h2>
                <button className="text-sm text-green-600">
                  Change Password
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm">{username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm">••••••••••••</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Quick Actions</h2>
              </div>
              <div className="space-y-2">
                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded">
                  <Plus className="h-4 w-4" />
                  <span>Add Doctor</span>
                </button>
                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded">
                  <Plus className="h-4 w-4" />
                  <span>Add Facility</span>
                </button>
                <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded">
                  <Plus className="h-4 w-4" />
                  <span>Add Admin</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
