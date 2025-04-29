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
  Bell,
} from "lucide-react";
import { useHospitalAuth } from "@/context/HospitalAuthContext";
import { useRouter } from "next/navigation";
import { logoutHospital } from "@/lib/api/hospital";
function Dashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { hospitalData, isAuthenticated, isLoading, logout } =
    useHospitalAuth();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!hospitalData) {
    return null; // Will redirect due to the useEffect above
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
  const handleLogout = async () => {
    try {
      console.log("hospitalData", hospitalData);
      const success = await logoutHospital(username);
      if (success) {
        console.log("logout successful");
        logout(); // Call the logout function from context
        // The router.push("/") is no longer needed here as we handle
        // the redirect in useEffect when isAuthenticated changes
      } else {
        console.error("Logout failed");
        // Optionally show a notification to user
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="bg-white shadow-sm border-r border-gray-200 w-64 fixed inset-y-0 hidden md:flex md:flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-emerald-600 mr-2" />
            <span className="text-emerald-600 text-2xl font-bold">
              MediCare
            </span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 p-2 text-gray-900 bg-emerald-50 rounded-md"
            >
              <Building2 className="h-5 w-5 text-emerald-600" />
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
          </div>
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-emerald-600 mr-2" />
            <span className="text-emerald-600 text-2xl font-bold">
              MediCare
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 p-2 text-gray-900 bg-emerald-50 rounded-md"
            >
              <Building2 className="h-5 w-5 text-emerald-600" />
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
              onClick={handleLogout}
              className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-md w-full mt-4"
            >
              <span>Log out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-5 w-5" />
            </button>
            {/* Page title */}
            <h1 className="text-lg font-semibold text-gray-800 md:ml-2">
              {name || "Hospital Dashboard"}
            </h1>
          </div>

          {/* Right side - Admin profile and dropdown */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Admin dropdown */}
            <div className="relative admin-dropdown">
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center space-x-2 text-sm focus:outline-none"
              >
                {/* Admin avatar */}
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  {name?.charAt(0) || "H"}
                </div>

                <div className="hidden md:flex flex-col items-start">
                  <span className="font-medium text-gray-900">{name}</span>
                  <span className="text-xs text-emerald-600">
                    Hospital Admin
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    adminMenuOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Admin dropdown menu */}
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{username}</p>
                  </div>

                  <a
                    href="#"
                    onClick={() => setAdminMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                  </a>
                  <a
                    href="#"
                    onClick={() => setAdminMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Shield className="h-4 w-4 inline mr-2" />
                    Settings
                  </a>

                  <hr className="my-1" />

                  <button
                    onClick={() => {
                      setAdminMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <svg
                      className="h-4 w-4 inline mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v7a1 1 0 11-2 0V4H5v16h11v-6a1 1 0 112 0v7a1 1 0 01-1 1H4a1 1 0 01-1-1V3z"
                        clipRule="evenodd"
                      />
                      <path d="M10 12.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586V7a1 1 0 112 0v5.586z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4">
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
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-emerald-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Doctors</p>
                  <p className="text-2xl font-bold">
                    {doctorUnderHospitalID?.length || 0}
                  </p>
                </div>
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Facilities</p>
                  <p className="text-2xl font-bold">
                    {facilitiesInHospital?.length || 0}
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
                <button className="text-sm text-emerald-600">
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
