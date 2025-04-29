// import React from "react";
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { 
//   User, 
//   Settings, 
//   CreditCard, 
//   MapPin,
//   Briefcase 
// } from "lucide-react";

// export default function ProfileDetails({ doctorProfile }) {
//   return (
//     <div className="space-y-6 animate-fadeIn">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Personal Information Card */}
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center">
//               <User className="h-5 w-5 mr-2 text-green-600" />
//               Personal Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-gray-500">Full Name</p>
//               <p className="font-medium">
//                 {doctorProfile?.name ? `Dr. ${doctorProfile.name}` : "Not provided"}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Email</p>
//               <p className="font-medium">
//                 {doctorProfile?.email || "Not provided"}
//               </p>
//             </div>
//             {doctorProfile?.username && (
//               <div>
//                 <p className="text-sm text-gray-500">Username</p>
//                 <p className="font-medium">
//                   @{doctorProfile.username}
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Professional Details Card */}
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center">
//               <Settings className="h-5 w-5 mr-2 text-green-600" />
//               Professional Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-gray-500">Medical License</p>
//               <p className="font-medium">
//                 {doctorProfile?.licenseNumber || "Not provided"}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Experience</p>
//               <p className="font-medium">
//                 {doctorProfile?.yearsOfExperience 
//                   ? `${doctorProfile.yearsOfExperience} years` 
//                   : "Not provided"}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Specialization</p>
//               <p className="font-medium capitalize">
//                 {doctorProfile?.specialization || "Not provided"}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Consultation Details Card */}
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg flex items-center">
//               <CreditCard className="h-5 w-5 mr-2 text-green-600" />
//               Consultation Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div>
//               <p className="text-sm text-gray-500">Consultation Fee</p>
//               <p className="font-medium">
//                 ₹{doctorProfile?.consultationFee || "0"}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">
//                 Average Consultation Time
//               </p>
//               <p className="font-medium">
//                 {doctorProfile?.averageConsultationTime || "0"} minutes
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Appointments</p>
//               <p className="font-medium">
//                 {doctorProfile?.appointmentsTrackOfDoctor?.length || 0} appointments
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Location Details */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-lg flex items-center">
//             <MapPin className="h-5 w-5 mr-2 text-green-600" />
//             Practice Locations
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {doctorProfile?.locationsOfDoctor &&
//           doctorProfile.locationsOfDoctor.length > 0 ? (
//             <div className="divide-y divide-gray-100">
//               {doctorProfile.locationsOfDoctor.map((location, index) => (
//                 <div key={index} className="p-4">
//                   <div className="flex items-start">
//                     <div className="bg-green-100 text-green-500 rounded-full p-2 mr-3">
//                       <Briefcase className="h-4 w-4" />
//                     </div>
//                     <div>
//                       <div className="text-gray-800 font-medium">
//                         {location.isPrimaryLocation && (
//                           <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded mr-2">
//                             Primary
//                           </span>
//                         )}
//                         Location {index + 1}
//                       </div>
//                       <div className="text-gray-600 mt-1">
//                         {location.addressline1}
//                         {location.addressLine2 && `, ${location.addressLine2}`}
//                         {location.addressLine3 && `, ${location.addressLine3}`}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="p-6 text-center text-gray-500">
//               No practice locations added yet.
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }