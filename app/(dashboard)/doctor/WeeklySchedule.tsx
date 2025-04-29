// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Calendar,
//   Clock,
//   CalendarDays,
//   Plus,
//   Edit,
//   Info,
//   AlertCircle,
// } from "lucide-react";
// import TimeSlotDetailsModal from "../timeslot/TimeSlotDetailsModal";
// import ExceptionBadge from "../timeslot/ExceptionBadge";
// import { getTimeDisplay } from "@/utils/timeFormatter";

// export default function WeeklySchedule({
//   availability,
//   setShowTimeSlotModal,
//   setSelectedSlot,
// }) {
//   const [detailSlot, setDetailSlot] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   // Check if there's any schedule data
//   const hasSchedule = Object.values(availability || {}).some(
//     (slots) => Array.isArray(slots) && slots.length > 0
//   );

//   // Days of the week with corresponding icons
//   const daysWithIcons = [
//     { day: "Monday", icon: Calendar },
//     { day: "Tuesday", icon: Calendar },
//     { day: "Wednesday", icon: Calendar },
//     { day: "Thursday", icon: Calendar },
//     { day: "Friday", icon: Calendar },
//     { day: "Saturday", icon: CalendarDays },
//     { day: "Sunday", icon: CalendarDays },
//   ];

//   // Handle click on a time slot to view details
//   const handleViewDetails = (day, slot) => {
//     const slotWithContext = {
//       ...slot,
//       day,
//     };
//     setDetailSlot(slotWithContext);
//     setShowDetailsModal(true);
//   };

//   // Handle edit button click - prepare slot data for editing
//   const handleEditSlot = (day, slot) => {
//     // Create slot data for editing - ensure all required fields are included
//     const slotForEdit = {
//       day: day,
//       start: slot.start, // Keep original format
//       end: slot.end, // Keep original format
//       startFormatted: slot.startFormatted, // Keep display format
//       endFormatted: slot.endFormatted, // Keep display format
//       capacity: slot.capacity || 1,
//       isRecurring: slot.isRecurring || true, // Weekly schedule slots are usually recurring
//       status: slot.status || (slot.isAvailable ? "ACTIVE" : "INACTIVE"),
//       exceptions: slot.exceptions || [],
//       isEditMode: true,
//       originalStart: slot.start, // Track original time for updating
//     };

//     console.log(
//       "Setting up edit for time slot from profile view:",
//       slotForEdit
//     );

//     // Set selected slot and open modal
//     setSelectedSlot(slotForEdit);
//     setShowTimeSlotModal(true);
//   };

//   // Handle add time slot for a specific day
//   const handleAddSlot = (day) => {
//     // Reset selected slot with the day pre-selected
//     setSelectedSlot({
//       day: day,
//       start: "09:00",
//       end: "17:00",
//       isRecurring: true,
//       capacity: 1,
//       status: "ACTIVE",
//       isEditMode: false,
//     });
//     setShowTimeSlotModal(true);
//   };

//   // Check if a slot has exceptions
//   const hasExceptions = (slot) => {
//     return slot.exceptions && slot.exceptions.length > 0;
//   };

//   // Enhance each slot with formatted time and upcoming exceptions
//   const enhancedAvailability = {};
//   for (const [day, slots] of Object.entries(availability || {})) {
//     enhancedAvailability[day] = Array.isArray(slots)
//       ? slots.map((slot) => {
//           console.log(`Processing slot for ${day}:`, JSON.stringify(slot));

//           // Ensure exceptions are properly parsed and normalized
//           const normalizedExceptions = Array.isArray(slot.exceptions)
//             ? slot.exceptions.map((exception) => {
//                 console.log(`Exception data:`, JSON.stringify(exception));
//                 return {
//                   ...exception,
//                   expectedDateOfException:
//                     exception.expectedDateOfException || null,
//                 };
//               })
//             : [];

//           // Calculate upcoming exceptions
//           const upcomingExceptions = normalizedExceptions
//             .filter((exception) => {
//               if (!exception.expectedDateOfException) {
//                 console.warn(
//                   "Exception missing expectedDateOfException:",
//                   exception
//                 );
//                 return false;
//               }
//               const exceptionDate = new Date(exception.expectedDateOfException);
//               const today = new Date();
//               return !isNaN(exceptionDate) && exceptionDate >= today;
//             })
//             .sort(
//               (a, b) =>
//                 new Date(a.expectedDateOfException) -
//                 new Date(b.expectedDateOfException)
//             )
//             .slice(0, 2); // Limit to 2 most recent for display

//           console.log(
//             `Found ${upcomingExceptions.length} upcoming exceptions for ${day} slot`
//           );

//           return {
//             ...slot,
//             // Use the time display utility that respects backend formats
//             startFormatted: getTimeDisplay(slot.start),
//             endFormatted: getTimeDisplay(slot.end),
//             exceptions: normalizedExceptions,
//             upcomingExceptions: upcomingExceptions,
//             // Track if this slot has exceptions
//             hasExceptions: normalizedExceptions.length > 0,
//           };
//         })
//       : [];
//   }

//   return (
//     <div className="animate-fadeIn">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-2">
//           <CardTitle className="text-lg flex items-center">
//             <Calendar className="h-5 w-5 mr-2 text-green-600" />
//             Weekly Schedule
//           </CardTitle>
//           <Button
//             onClick={() => {
//               setSelectedSlot(null);
//               setShowTimeSlotModal(true);
//             }}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Time Slot
//           </Button>
//         </CardHeader>

//         <CardContent>
//           {hasSchedule ? (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
//               {daysWithIcons.map(({ day, icon: DayIcon }) => (
//                 <div key={day} className="p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center">
//                       <div
//                         className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
//                           (enhancedAvailability[day]?.length || 0) > 0
//                             ? "bg-green-100 text-green-600"
//                             : "bg-gray-100 text-gray-400"
//                         }`}
//                       >
//                         <DayIcon className="h-5 w-5" />
//                       </div>
//                       <h4 className="font-medium text-gray-800">{day}</h4>
//                     </div>

//                     {/* Add time slot button for this day */}
//                     <Button
//                       onClick={() => handleAddSlot(day)}
//                       size="sm"
//                       variant="outline"
//                       className="bg-green-50 text-green-600 hover:bg-green-100 flex items-center"
//                     >
//                       <Plus className="h-3 w-3 mr-1" /> Add Slot
//                     </Button>
//                   </div>

//                   {enhancedAvailability[day] &&
//                   enhancedAvailability[day].length > 0 ? (
//                     <div className="ml-12 space-y-2">
//                       {enhancedAvailability[day].map((slot, index) => (
//                         <div
//                           key={index}
//                           className={`rounded-md text-sm transition-all duration-300 ${
//                             slot.isAvailable
//                               ? "bg-green-50 text-green-700 border border-green-200"
//                               : "bg-red-50 text-red-700 border border-red-200"
//                           } ${
//                             slot.hasExceptions ? "border-red-300 shadow-sm" : ""
//                           }`}
//                         >
//                           <div className="p-2">
//                             <div
//                               className="flex items-center justify-between cursor-pointer"
//                               onClick={() => handleViewDetails(day, slot)}
//                             >
//                               <div className="flex items-center">
//                                 {slot.hasExceptions ? (
//                                   <div className="relative mr-2">
//                                     <AlertCircle className="h-4 w-4 text-red-500" />
//                                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//                                   </div>
//                                 ) : (
//                                   <Clock className="h-4 w-4 text-green-600 mr-2" />
//                                 )}
//                                 <span>
//                                   {slot.startFormatted} - {slot.endFormatted}
//                                 </span>

//                                 {!slot.isRecurring && (
//                                   <Badge
//                                     className="ml-2 bg-yellow-100 text-yellow-700 px-1.5 py-0.5"
//                                     variant="outline"
//                                   >
//                                     Non-recurring
//                                   </Badge>
//                                 )}

//                                 {slot.capacity && (
//                                   <span className="ml-2 text-xs bg-white bg-opacity-80 px-1.5 py-0.5 rounded">
//                                     {slot.capacity} patients
//                                   </span>
//                                 )}
//                               </div>

//                               <div className="flex items-center space-x-2">
//                                 {/* Edit button */}
//                                 <Button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleEditSlot(day, slot);
//                                   }}
//                                   size="sm"
//                                   variant="ghost"
//                                   className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
//                                 >
//                                   <Edit className="h-4 w-4" />
//                                 </Button>

//                                 {/* Info/Details button */}
//                                 <Button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleViewDetails(day, slot);
//                                   }}
//                                   size="sm"
//                                   variant="ghost"
//                                   className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 h-8 w-8 p-0"
//                                 >
//                                   <Info className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </div>

//                             {/* Display upcoming exceptions directly in the card */}
//                             {slot.upcomingExceptions &&
//                               slot.upcomingExceptions.length > 0 && (
//                                 <div className="mt-1.5 flex flex-wrap gap-1.5 items-center border-t border-red-200 pt-1.5">
//                                   <span className="text-xs text-red-600 font-medium">
//                                     <AlertCircle className="h-3 w-3 inline mr-1" />
//                                     Unavailable:
//                                   </span>
//                                   {slot.upcomingExceptions.map(
//                                     (exception, idx) => (
//                                       <ExceptionBadge
//                                         key={idx}
//                                         exception={exception}
//                                         compact={true}
//                                       />
//                                     )
//                                   )}

//                                   {/* Additional exceptions indicator */}
//                                   {(slot.exceptions?.length || 0) > 2 && (
//                                     <Badge
//                                       variant="outline"
//                                       className="text-xs text-red-600 bg-red-50"
//                                     >
//                                       +{(slot.exceptions?.length || 0) - 2} more
//                                     </Badge>
//                                   )}
//                                 </div>
//                               )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="ml-12 text-gray-500 text-sm italic">
//                       No slots scheduled
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
//               <div className="text-gray-400 mb-2">
//                 <Calendar className="h-12 w-12 mx-auto" />
//               </div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">
//                 No Schedule Available
//               </h4>
//               <p className="text-gray-500 mb-4">
//                 You haven't set up your weekly schedule yet.
//               </p>
//               <Button
//                 className="bg-green-600 hover:bg-green-700 text-white flex items-center mx-auto"
//                 onClick={() => {
//                   setSelectedSlot(null);
//                   setShowTimeSlotModal(true);
//                 }}
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Time Slots
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Time Slot Details Modal */}
//       <TimeSlotDetailsModal
//         slot={detailSlot}
//         showModal={showDetailsModal}
//         setShowModal={setShowDetailsModal}
//         onEdit={() => {
//           setShowDetailsModal(false);
//           if (detailSlot) handleEditSlot(detailSlot.day, detailSlot);
//         }}
//         onDelete={() => {
//           setShowDetailsModal(false);
//           // Delete functionality would be added here if needed
//           alert("Delete functionality is only available on the Schedule page");
//         }}
//       />
//     </div>
//   );
// }
