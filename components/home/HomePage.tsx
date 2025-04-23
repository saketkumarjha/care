import React from "react";
import {
  Heart,
  User,
  Phone,
  MapPin,
  Calendar,
  PlusCircle,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from 'next/navigation';
function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();
  interface HandleNavigationProps {
    path: string;
  }

  const handleNavigation = (path: HandleNavigationProps["path"]): void => {
    router.push(path);
    setIsMenuOpen(false); // Close the menu after navigation
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6" />
              <span className="font-bold text-xl">MediCare Hospital</span>
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
              <button
                onClick={() => handleNavigation("/login/hospital")}
                className="bg-white text-green-600 px-4 py-1 rounded-md font-medium hover:bg-green-100 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavigation("/register/hospital")}
                className="bg-green-700 text-white px-4 py-1 rounded-md font-medium hover:bg-green-800 transition-colors"
              >
                Sign Up
              </button>
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
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleNavigation("/login/hospital")}
                  className="bg-white text-green-600 px-4 py-1 rounded-md font-medium hover:bg-green-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation("/register/hospital")}
                  className="bg-green-700 text-white px-4 py-1 rounded-md font-medium hover:bg-green-800 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Your Health Is Our Priority
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Experience world-class healthcare services with compassionate care
              and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </button>
              <button className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center">
                <Phone className="mr-2 h-5 w-5" />
                Emergency Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
                <PlusCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Emergency Care
              </h3>
              <p className="text-gray-700">
                24/7 emergency services with rapid response times and advanced
                life-saving equipment.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-green-600 font-medium mt-4 hover:text-green-700"
              >
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Specialist Consultations
              </h3>
              <p className="text-gray-700">
                Expert specialists providing personalized care across all
                medical disciplines.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-green-600 font-medium mt-4 hover:text-green-700"
              >
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>

            {/* Feature 3 */}
            <div className="bg-green-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Advanced Diagnostics
              </h3>
              <p className="text-gray-700">
                State-of-the-art diagnostic equipment for accurate and timely
                test results.
              </p>
              <a
                href="#"
                className="inline-flex items-center text-green-600 font-medium mt-4 hover:text-green-700"
              >
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Our Healthcare Family
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create an account to access our patient portal, schedule
            appointments, and manage your healthcare journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-100 transition-colors">
              Sign In
            </button>
            <button className="bg-green-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6" />
                <span className="font-bold text-xl">MediCare Hospital</span>
              </div>
              <p className="max-w-md">
                Providing exceptional healthcare services with compassion and
                excellence for over 25 years.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Doctors
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Appointments
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Services</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Emergency Care
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Diagnostics
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Surgery
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-green-300 transition-colors"
                    >
                      Rehabilitation
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-1" />
                    <span>
                      123 Healthcare Avenue, Medical District, City, 12345
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>(123) 456-7890</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-300">
            <p>&copy; 2025 MediCare Hospital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
