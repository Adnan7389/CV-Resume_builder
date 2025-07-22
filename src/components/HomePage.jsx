import React from 'react';
import { FileText, GraduationCap, Star, Users } from 'lucide-react';

const HomePage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart CV & Resume Generator</h1>
            </div>
            <div className="text-sm text-gray-600">
              For Ethiopian Students
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create a Professional Resume or CV 
            <span className="text-green-600"> Instantly</span> Using AI
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto px-4">
            Transform your academic achievements and experiences into a compelling professional document. 
            Our AI-powered platform is specifically designed for Ethiopian university students and graduates.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">AI-Powered Content</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Our intelligent system transforms your input into professional, 
              well-structured content that highlights your strengths and achievements.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Professional Templates</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Choose from carefully designed templates that meet Ethiopian job market standards 
              and make a lasting impression on employers.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Student-Focused</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Specifically designed for Ethiopian university students and graduates, 
              with features that highlight academic achievements and potential.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                1
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Enter Information</h4>
              <p className="text-xs sm:text-sm text-gray-600">Fill in your academic and personal details</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                2
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Choose Format</h4>
              <p className="text-xs sm:text-sm text-gray-600">Select CV or Resume and pick a template</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                3
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">AI Generation</h4>
              <p className="text-xs sm:text-sm text-gray-600">Our AI creates professional content</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
                4
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Download PDF</h4>
              <p className="text-xs sm:text-sm text-gray-600">Export your polished document</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-300">
            © 2025 Smart CV & Resume Generator. Empowering Ethiopian students to achieve their career goals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;