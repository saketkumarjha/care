import React, { useState } from "react";
import { Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);
  const [showSignUpDropdown, setShowSignUpDropdown] = useState(false);
  const router = useRouter();

  interface HandleNavigationProps {
    path: string;
  }

  const handleNavigation = (path: HandleNavigationProps["path"]): void => {
    router.push(path);
    setIsMenuOpen(false); // Close the menu after navigation
  };

  // Function to handle user type selection for sign in
  const handleSignIn = (userType: string) => {
    let path = "";
    switch (userType) {
      case "doctor":
        path = "/login/doctor";
        break;
      case "hospital":
        path = "/login/hospital";
        break;
      case "patient":
        path = "/login/patient";
        break;
      default:
        path = "/login";
    }
    handleNavigation(path);
    setShowSignInDropdown(false);
  };

  // Function to handle user type selection for sign up
  const handleSignUp = (userType: string) => {
    let path = "";
    switch (userType) {
      case "doctor":
        path = "/register/doctor";
        break;
      case "hospital":
        path = "/register/hospital";
        break;
      case "patient":
        path = "/register/patient";
        break;
      default:
        path = "/register";
    }
    handleNavigation(path);
    setShowSignUpDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6" />
              <span className="font-bold text-xl">CareSetu</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#" className="hover:text-green-200 transition-colors">
                Home
              </a>
              <a href="#" className="hover:text-green-200 transition-colors">
                Services
              </a>
              <a href="#" className="hover:text-green-200 transition-colors">
                Doctors
              </a>
              <a href="#" className="hover:text-green-200 transition-colors">
                About
              </a>
              <a href="#" className="hover:text-green-200 transition-colors">
                Contact
              </a>

              {/* Sign In with dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowSignInDropdown(true)}
                  className="bg-white text-green-600 px-4 py-1 rounded-md font-medium hover:bg-green-100 transition-colors flex items-center"
                >
                  Sign In
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {/* Sign In Dropdown */}
                {showSignInDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    onMouseEnter={() => setShowSignInDropdown(true)}
                    onMouseLeave={() => setShowSignInDropdown(false)}
                  >
                    <ul className="py-1">
                      <li
                        onClick={() => handleSignIn("doctor")}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 cursor-pointer flex items-center"
                      >
                        <User size={16} className="mr-2" />
                        As Doctor
                      </li>
                      <li
                        onClick={() => handleSignIn("hospital")}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 cursor-pointer flex items-center"
                      >
                        <Heart size={16} className="mr-2" />
                        As Hospital
                      </li>
                      <li
                        onClick={() => handleSignIn("patient")}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 cursor-pointer flex items-center"
                      >
                        <User size={16} className="mr-2" />
                        As Patient
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Sign Up with dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowSignUpDropdown(true)}
                  className="bg-green-700 text-white px-4 py-1 rounded-md font-medium hover:bg-green-800 transition-colors flex items-center"
                >
                  Sign Up
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {/* Sign Up Dropdown */}
                {showSignUpDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    onMouseEnter={() => setShowSignUpDropdown(true)}
                    onMouseLeave={() => setShowSignUpDropdown(false)}
                  >
                    <ul className="py-1">
                      <li
                        onClick={() => handleSignUp("doctor")}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 cursor-pointer flex items-center"
                      >
                        <User size={16} className="mr-2" />
                        As Doctor
                      </li>
                      <li
                        onClick={() => handleSignUp("hospital")}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 cursor-pointer flex items-center"
                      >
                        <Heart size={16} className="mr-2" />
                        As Hospital
                      </li>
                      <li
                        onClick={() => handleSignUp("patient")}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-green-800 cursor-pointer flex items-center"
                      >
                        <User size={16} className="mr-2" />
                        As Patient
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-600 py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <a
                href="#"
                className="text-white hover:text-green-200 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-white hover:text-green-200 transition-colors"
              >
                Services
              </a>
              <a
                href="#"
                className="text-white hover:text-green-200 transition-colors"
              >
                Doctors
              </a>
              <a
                href="#"
                className="text-white hover:text-green-200 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-white hover:text-green-200 transition-colors"
              >
                Contact
              </a>

              {/* Mobile Sign In Options */}
              <div className="pt-2">
                <div className="text-white mb-2">Sign In As:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSignIn("doctor")}
                    className="bg-white text-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-100 transition-colors flex items-center"
                  >
                    <User size={14} className="mr-1" />
                    Doctor
                  </button>
                  <button
                    onClick={() => handleSignIn("hospital")}
                    className="bg-white text-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-100 transition-colors flex items-center"
                  >
                    <Heart size={14} className="mr-1" />
                    Hospital
                  </button>
                  <button
                    onClick={() => handleSignIn("patient")}
                    className="bg-white text-green-600 px-3 py-1 rounded-md text-sm hover:bg-green-100 transition-colors flex items-center"
                  >
                    <User size={14} className="mr-1" />
                    Patient
                  </button>
                </div>
              </div>

              {/* Mobile Sign Up Options */}
              <div className="pt-1">
                <div className="text-white mb-2">Sign Up As:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSignUp("doctor")}
                    className="bg-green-700 text-white px-3 py-1 rounded-md text-sm hover:bg-green-800 transition-colors flex items-center"
                  >
                    <User size={14} className="mr-1" />
                    Doctor
                  </button>
                  <button
                    onClick={() => handleSignUp("hospital")}
                    className="bg-green-700 text-white px-3 py-1 rounded-md text-sm hover:bg-green-800 transition-colors flex items-center"
                  >
                    <Heart size={14} className="mr-1" />
                    Hospital
                  </button>
                  <button
                    onClick={() => handleSignUp("patient")}
                    className="bg-green-700 text-white px-3 py-1 rounded-md text-sm hover:bg-green-800 transition-colors flex items-center"
                  >
                    <User size={14} className="mr-1" />
                    Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Rest of the page content would go here */}
    </div>
  );
}

export default HomePage;
