import React, { useState } from 'react';
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // In a real application, this is where you would handle the API response
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <span className="font-bold text-xl">MediCare Hospital</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Back button */}
          <a href="/login" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </a>
          
          {/* Forgot Password Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-green-600 px-6 py-4">
              <h1 className="text-white text-xl font-bold">Reset Password</h1>
              <p className="text-green-100 text-sm">We`&apos;`ll send you instructions to reset your password</p>
            </div>
            
            {/* Card Body */}
            <div className="p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  {/* Email field */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Enter the email address associated with your account, and we`&apos;`ll send you a link to reset your password.
                    </p>
                  </div>
                  
                  {/* Submit button */}
                  <button
                    type="submit"
                    className={`w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-700'
                    } transition-colors`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      We`&apos;`ve sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      If you don`&apos;`t see it, please check your spam folder.
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Didn`&apos;`t receive the email? Try again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Help text */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Remember your password?{' '}
            <a href="/login" className="text-green-600 hover:text-green-500 font-medium">
              Back to login
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 MediCare Hospital. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default ForgotPasswordPage;