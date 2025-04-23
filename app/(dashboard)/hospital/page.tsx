import React, { useState } from 'react';
import { 
  Heart, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Activity, 
   
  Star, 
  User, 
  Plus, 
  Menu, 
  X,
  
  Shield
} from 'lucide-react';
import Image from 'next/image';
function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Hospital data from your JSON
  const hospitalData = {
    "name": "Serenity Medical Institute",
    "password": "SecurePass@456",
    "username": "serenityMedical",
    "hospitalAddress": {
      "addressLine1": "87 Crystal Avenue",
      "addressLine2": "Electronic City, Bangalore",
      "addressLine3": "560100"
    },
    "contactNumberOfHospital": "7019283746",
    "emailOfHospital": "serenity.medical@healthcare.com",
    "licenseNumberOfHospital": "KA/23456/2023",
    "ratingOfHospital": 0,
    "isActive": true,
    "hospitalImages": [
      "http://res.cloudinary.com/dyv2dd9e2/image/upload/v1745086592/CareSetu/ii3hkqsuyu6ffv1uya3l.jpg"
    ],
    "facilitiesInHospital": [
      {
        "name": "Emergency Care",
        "description": "24/7 emergency medical services",
        "cost": 500,
        "isAvailable": true
      }
    ],
    "doctorUnderHospitalID": [],
    "adminsInTheHospital": []
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white py-3 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <span className="font-bold text-xl">MediCare</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 bg-green-700 rounded-full py-1 px-3">
              <span className="text-xs font-medium">Hospital Admin</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="hidden md:block text-sm text-right">
                <div className="font-medium">Serenity Medical</div>
                <div className="text-green-200 text-xs">Admin</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                SM
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
              <p className="text-sm text-gray-500">Manage your hospital</p>
            </div>
            
            <nav className="flex-grow py-5 overflow-y-auto">
              <ul className="space-y-1 px-3">
                <li>
                  <a href="#" className="flex items-center py-2 px-3 text-gray-900 bg-green-50 rounded-md group">
                    <Building2 className="mr-3 h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Overview</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md group">
                    <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
                    <span className="text-sm font-medium">Doctors</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md group">
                    <Activity className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
                    <span className="text-sm font-medium">Facilities</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md group">
                    <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
                    <span className="text-sm font-medium">Settings</span>
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <button className="flex items-center py-2 px-3 text-red-600 hover:bg-red-50 rounded-md w-full">
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg">
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
                  <p className="text-sm text-gray-500">Manage your hospital</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <nav className="py-5">
                <ul className="space-y-1 px-3">
                  <li>
                    <a href="#" className="flex items-center py-2 px-3 text-gray-900 bg-green-50 rounded-md group">
                      <Building2 className="mr-3 h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Overview</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md group">
                      <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
                      <span className="text-sm font-medium">Doctors</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md group">
                      <Activity className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
                      <span className="text-sm font-medium">Facilities</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md group">
                      <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-green-600" />
                      <span className="text-sm font-medium">Settings</span>
                    </a>
                  </li>
                </ul>
              </nav>
              
              <div className="p-4 border-t border-gray-200">
                <button className="flex items-center py-2 px-3 text-red-600 hover:bg-red-50 rounded-md w-full">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="text-sm font-medium">Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow p-5 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header with hospital name and status */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{hospitalData.name}</h1>
                <p className="text-sm text-gray-500">License: {hospitalData.licenseNumberOfHospital}</p>
              </div>
              <div className="mt-3 md:mt-0 flex items-center">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${hospitalData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {hospitalData.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">{hospitalData.doctorUnderHospitalID.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Facilities</p>
                    <p className="text-2xl font-bold text-gray-900">{hospitalData.facilitiesInHospital.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-5 border-l-4 border-yellow-500">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hospital Rating</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-gray-900 mr-2">{hospitalData.ratingOfHospital}</p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= hospitalData.ratingOfHospital ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hospital Information */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Hospital Information</h2>
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">Edit</button>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row mb-4">
                      <div className="w-full md:w-2/5 lg:w-1/3">
                        <Image
                          src={hospitalData.hospitalImages[0]} 
                          alt={hospitalData.name}
                          className="w-full h-48 object-cover rounded-lg"
                        //   onError={(e) => { e.target.src = "/api/placeholder/400/300" }}
                        />
                      </div>
                      <div className="w-full md:w-3/5 lg:w-2/3 mt-4 md:mt-0 md:pl-5">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="text-sm font-medium text-gray-900">
                                {hospitalData.hospitalAddress.addressLine1}, 
                                <br />
                                {hospitalData.hospitalAddress.addressLine2}, 
                                <br />
                                {hospitalData.hospitalAddress.addressLine3}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Contact Number</p>
                              <p className="text-sm font-medium text-gray-900">
                                {hospitalData.contactNumberOfHospital}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="text-sm font-medium text-gray-900">
                                {hospitalData.emailOfHospital}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FileText className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">License Number</p>
                              <p className="text-sm font-medium text-gray-900">
                                {hospitalData.licenseNumberOfHospital}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Facilities */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Facilities</h2>
                    <button className="inline-flex items-center px-3 py-1 bg-green-100 border border-transparent text-sm font-medium rounded-md text-green-700 hover:bg-green-200 transition-colors">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Facility
                    </button>
                  </div>
                  
                  <div className="p-5">
                    {hospitalData.facilitiesInHospital.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {hospitalData.facilitiesInHospital.map((facility, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{facility.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">₹{facility.cost}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${facility.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {facility.isAvailable ? 'Available' : 'Unavailable'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                                  <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">No facilities found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Side Content */}
              <div className="lg:col-span-1">
                {/* Hospital Account */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800">Account Information</h2>
                  </div>
                  <div className="p-5">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <div className="flex mt-1">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm font-medium text-gray-900">{hospitalData.username}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Password</p>
                        <div className="flex mt-1">
                          <Shield className="h-5 w-5 text-gray-400 mr-2" />
                          <p className="text-sm font-medium text-gray-900">••••••••••••</p>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Admin Management */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Administrators</h2>
                    <button className="inline-flex items-center text-sm text-green-600 hover:text-green-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Admin
                    </button>
                  </div>
                  <div className="p-5">
                    {hospitalData.adminsInTheHospital.length > 0 ? (
                      <div className="space-y-3">
                        {hospitalData.adminsInTheHospital.map((admin, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-xs">
                                {/* Display admin initials or icon */}
                                AD
                              </div>
                              <div className="ml-3">
                                {/* <p className="text-sm font-medium text-gray-900">{admin.name || 'Admin Name'}</p> */}
                                {/* <p className="text-xs text-gray-500">{admin.role || 'Admin'}</p> */}
                              </div>
                            </div>
                            <button className="text-red-600 hover:text-red-900">
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-gray-500 text-sm">No administrators found</p>
                        <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                          <Plus className="h-4 w-4 mr-1" />
                          Add your first admin
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Doctors Quick View */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Doctors</h2>
                    <button className="inline-flex items-center text-sm text-green-600 hover:text-green-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Doctor
                    </button>
                  </div>
                  <div className="p-5">
                    {hospitalData.doctorUnderHospitalID.length > 0 ? (
                      <div className="space-y-3">
                        {hospitalData.doctorUnderHospitalID.map((doctor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                {/* Display doctor initials or icon */}
                                DR
                              </div>
                              <div className="ml-3">
                                {/* <p className="text-sm font-medium text-gray-900">{doctor.name || 'Doctor Name'}</p>
                                <p className="text-xs text-gray-500">{doctor.specialization || 'Specialization'}</p> */}
                              </div>
                            </div>
                            <button className="text-green-600 hover:text-green-900">
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <p className="text-gray-500 text-sm">No doctors found</p>
                        <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors">
                          <Plus className="h-4 w-4 mr-1" />
                          Add your first doctor
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;