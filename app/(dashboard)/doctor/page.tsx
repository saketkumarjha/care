"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CalendarDays,
  Clock,
  MapPin,
  Star,
  CreditCard,
  Edit,
  User,
  Calendar,
  Settings,
  FileEdit,
} from "lucide-react";
import { useDoctorAuth } from "@/context/DoctorAuthContext"; // Adjust the import path as needed
import {
  updateDoctorProfile,
  updateDoctorAvatar,
  convertFileToBase64,
} from "@/lib/api/doctor";

// Define the TimeSlot type according to your context
type TimeSlot = {
  dayName: string;
  slots: Array<{
    startTime: string;
    endTime: string;
    maxPatientsInTheSlot?: number;
    isActive?: boolean;
    status?: string;
    recurring?: boolean;
    exceptions?: Array<{
      expectedDateOfException: string;
      status: string;
    }>;
  }>;
  _id?: string;
};

// Define the Location type according to your context
type Location = {
  addressline1: string;
  addressLine2: string;
  addressLine3: string;
  isPrimaryLocation: boolean;
  _id?: string;
};

// Define the Doctor type to match your context
type Doctor = {
  _id?: string;
  name: string;
  email: string;
  username: string;
  specialization: string;
  yearsOfExperience: number;
  consultationFee: number;
  averageConsultationTime: number;
  licenseNumber: string;
  doctorAvatarURL?: string;
  ratingOfDoctor?: number;
  timeSlots: TimeSlot[];
  locationsOfDoctor: Location[];
  appointmentsTrackOfDoctor?: any[];
  hospitalJoined?: any[];
};

const ProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  specialization: z
    .string()
    .min(2, { message: "Please enter your specialization." }),
  yearsOfExperience: z.coerce
    .number()
    .min(0, { message: "Please enter valid years of experience." }),
  consultationFee: z.coerce
    .number()
    .min(0, { message: "Please enter a valid consultation fee." }),
  averageConsultationTime: z.coerce
    .number()
    .min(0, { message: "Please enter a valid consultation time." }),
  licenseNumber: z.string().min(1, { message: "License number is required." }),
});

export default function DoctorDashboard() {
  // Get doctor data from context
  const { doctorData, setDoctorData, isAuthenticated } = useDoctorAuth();

  // Local state for doctor data
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploading] = useState(false);
  // Update local state when doctorData changes
  useEffect(() => {
    if (doctorData) {
      setDoctor({
        ...doctorData,
        ratingOfDoctor: 0, // Default rating if not provided
        appointmentsTrackOfDoctor: [], // Default empty appointments if not provided
        doctorAvatarURL: "No Profile Picture", // Default avatar URL
      });
    }
  }, [doctorData]);

  // Setup form with doctor data
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: doctor?.name || "",
      email: doctor?.email || "",
      specialization: doctor?.specialization || "",
      yearsOfExperience: doctor?.yearsOfExperience || 0,
      consultationFee: doctor?.consultationFee || 0,
      averageConsultationTime: doctor?.averageConsultationTime || 0,
      licenseNumber: doctor?.licenseNumber || "",
    },
  });

  // Update form values when doctor data changes
  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        yearsOfExperience: doctor.yearsOfExperience,
        consultationFee: doctor.consultationFee,
        averageConsultationTime: doctor.averageConsultationTime,
        licenseNumber: doctor.licenseNumber,
      });
    }
  }, [doctor, form]);

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    console.log(values);
    if (!doctorData || !doctorData._id || !doctorData.refreshToken) {
      console.log("missing doctorData or authentication");
    }
    setIsSubmitting(true);
    // Update local state
    try {
      const updateData = { ...doctorData, ...values };
      console.log(updateData);
      const response = await updateDoctorProfile(
        updateData as Required<typeof updateData>
      );
      if (response.success) {
        const updatedDoctor = { ...doctor, ...values };
        setDoctor(updatedDoctor as Required<typeof updateData>);
      }
      if (doctorData && setDoctorData) {
        setDoctorData({ ...doctorData, ...values });
        console.log("context updated with new Data");
      }
    } catch (error) {
      console.error("profile update error", error);
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
    if (doctor) {
      const updatedDoctor = { ...doctor, ...values };
      setDoctor(updatedDoctor);

      // Update context state if needed
      if (doctorData) {
        setDoctorData({ ...doctorData, ...values });
      }
    }

    setIsEditing(false);
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const uploadImage = async () => {
    if (!imageFile || !doctorData || !doctorData.refreshToken) {
      console.log(" Missing Image or Authentication");
    }
    setIsUploading(true);
    try {
      if (imageFile && doctorData != null) {
        const base64Image = await convertFileToBase64(imageFile);
        const response = await updateDoctorAvatar(doctorData, base64Image);
        if (response.success) {
          if (doctor) {
            const updatedDoctor = {
              ...doctor,
              doctorAvatarURL: previewUrl || doctor.doctorAvatarURL,
            };
            setDoctor(updatedDoctor);
            if (doctorData) {
              setDoctorData({
                ...doctorData,
                doctorAvatarURL: previewUrl || doctorData.doctorAvatarURL,
              });
              console.log("Profile picture updated successfully");
            }
          }
        }
      } else {
        console.error("Image file is null");
      }
    } catch (error) {
      console.log("Avatar update error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  // If not authenticated or no doctor data, show a message
  if (!isAuthenticated || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view your dashboard
          </h1>
          <p className="text-gray-500">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-green-600">
              {doctor.doctorAvatarURL &&
              doctor.doctorAvatarURL !== "No Profile Picture" ? (
                <AvatarImage src={doctor.doctorAvatarURL} alt={doctor.name} />
              ) : previewUrl ? (
                <AvatarImage src={previewUrl} alt={doctor.name} />
              ) : (
                <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                  {doctor.name
                    ? doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "DR"}
                </AvatarFallback>
              )}
            </Avatar>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>Update profile picture</DialogTitle>
                  <DialogDescription>
                    Choose a new profile picture to update your profile.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <Avatar className="h-32 w-32">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} alt={doctor.name} />
                    ) : doctor.doctorAvatarURL &&
                      doctor.doctorAvatarURL !== "No Profile Picture" ? (
                      <AvatarImage
                        src={doctor.doctorAvatarURL}
                        alt={doctor.name}
                      />
                    ) : (
                      <AvatarFallback className="bg-green-100 text-green-800 text-3xl">
                        {doctor.name
                          ? doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "DR"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Label
                    htmlFor="picture"
                    className="cursor-pointer bg-green-50 hover:bg-green-100 py-2 px-4 rounded-md border border-green-200"
                  >
                    Choose image
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isUploadingImage}
                    />
                  </Label>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreviewUrl(null);
                      setImageFile(null);
                    }}
                    disabled={isUploadingImage}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={uploadImage}
                    disabled={isUploadingImage || !imageFile}
                  >
                    {isUploadingImage ? "Uploading..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {doctor.name ? `Dr. ${doctor.name}` : "Doctor Profile"}
              {doctor.specialization && (
                <span className="text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {doctor.specialization}
                </span>
              )}
            </h1>
            {doctor.username && (
              <p className="text-gray-500">@{doctor.username}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center text-gray-700">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{doctor.ratingOfDoctor || "No ratings yet"}</span>
              </div>
              {doctor.consultationFee > 0 && (
                <div className="flex items-center text-gray-700">
                  <CreditCard className="h-4 w-4 text-green-600 mr-1" />
                  <span>₹{doctor.consultationFee}</span>
                </div>
              )}
              {doctor.averageConsultationTime > 0 && (
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 text-green-600 mr-1" />
                  <span>{doctor.averageConsultationTime} min</span>
                </div>
              )}
            </div>
          </div>

          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 md:self-start">
                <FileEdit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-white">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile information here.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Fee (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageConsultationTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Time (min)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">
              <User className="h-4 w-4 mr-2 hidden md:inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="h-4 w-4 mr-2 hidden md:inline" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <CalendarDays className="h-4 w-4 mr-2 hidden md:inline" />
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">
                      {doctor.name ? `Dr. ${doctor.name}` : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {doctor.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">
                      {doctor.username ? `@${doctor.username}` : "Not provided"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-green-600" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">
                      {doctor.specialization || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">
                      {doctor.yearsOfExperience > 0
                        ? `${doctor.yearsOfExperience} years`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">
                      {doctor.licenseNumber || "Not provided"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Consultation Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="font-medium">
                      {doctor.consultationFee > 0
                        ? `₹${doctor.consultationFee}`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Consultation Time</p>
                    <p className="font-medium">
                      {doctor.averageConsultationTime > 0
                        ? `${doctor.averageConsultationTime} minutes`
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <p className="font-medium">
                        {doctor.ratingOfDoctor || "No ratings yet"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-600" />
                    Available Time Slots
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Add Time Slot
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage your available consultation hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doctor.timeSlots && doctor.timeSlots.length > 0 ? (
                  <div className="space-y-4">
                    {doctor.timeSlots.map((day, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg text-green-700 mb-2">
                          {day.dayName}
                        </h3>
                        <div className="space-y-2">
                          {day.slots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="flex justify-between items-center border-b pb-2"
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-green-600" />
                                <span>
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                {slot.isActive === false && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No time slots added yet.</p>
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                      Add Your First Time Slot
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Practice Locations
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Add Location
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage your clinic and hospital locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doctor.locationsOfDoctor &&
                doctor.locationsOfDoctor.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.locationsOfDoctor.map((location, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 relative"
                      >
                        {location.isPrimaryLocation && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Primary
                          </div>
                        )}
                        <h3 className="font-medium text-lg mb-2">
                          {location.addressline1}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {location.addressLine2}
                        </p>
                        <p className="text-gray-600 mb-3">
                          {location.addressLine3}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {!location.isPrimaryLocation && (
                            <Button variant="outline" size="sm">
                              Set as Primary
                            </Button>
                          )}
                          {doctor.locationsOfDoctor.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No locations added yet.</p>
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">
                      Add Your First Location
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-green-600" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>
                  Manage your patient appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {doctor.appointmentsTrackOfDoctor &&
                doctor.appointmentsTrackOfDoctor.length > 0 ? (
                  <div className="space-y-4">
                    <p>Appointment list...</p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No Appointments
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You don&apos;t have any upcoming appointments. When
                      patients book consultations with you, they will appear
                      here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
