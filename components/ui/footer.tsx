// create footer component

import React from "react";
import { FaHeart as Heart } from "react-icons/fa"; // Assuming you are using react-icons
import { FaMapMarkerAlt as MapPin, FaPhone as Phone } from "react-icons/fa"; // Importing MapPin and Phone

function footer() {
  return (
    <div>
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Heart size={24} color="currentColor" />
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
                    <span className="mr-2 mt-1">
                      <MapPin size={20} />
                    </span>
                    <span>
                      123 Healthcare Avenue, Medical District, City, 12345
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Phone size={20}  />
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

export default footer;
