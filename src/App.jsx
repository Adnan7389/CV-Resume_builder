import React, { useState } from 'react';
import HomePage from './components/HomePage';
import InputForm from './components/InputForm';
import PreviewPanel from './components/PreviewPanel';
import { generateContent } from './utils/aiGenerator';

const initialUserData = {
  fullName: '',
  department: '',
  university: '',
  degree: '',
  graduationYear: '',
  cgpa: '',
  keyCourses: '',
  targetJobTitle: '',
  jobDescription: '',
  location: '',
  skills: [],
  workExperience: [],
  projects: [],
  certifications: [],
  languages: [],
  hobbies: [],
  references: [],
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  autoGenerateSummary: true,
  professionalSummary: '',
  exitExamScore: '',
  documentType: 'Resume',
  template: 'Simple'
};

function App() {
  const [currentState, setCurrentState] = useState('home');
  const [userData, setUserData] = useState(initialUserData);
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGetStarted = () => {
    setCurrentState('form');
  };

  const handleFormSubmit = (data) => {
    setUserData(data);
    const content = generateContent(data);
    setGeneratedContent(content);
    setCurrentState('preview');
  };

  const handleBackToForm = () => {
    setCurrentState('form');
  };

  const handleBackToHome = () => {
    setCurrentState('home');
    setUserData(initialUserData);
    setGeneratedContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentState === 'home' && (
        <HomePage onGetStarted={handleGetStarted} />
      )}
      
      {currentState === 'form' && (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <button
                onClick={handleBackToHome}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
            <InputForm onSubmit={handleFormSubmit} userData={userData} />
          </div>
        </div>
      )}
      
      {currentState === 'preview' && generatedContent && (
        <PreviewPanel 
          userData={userData}
          generatedContent={generatedContent}
          onBack={handleBackToForm}
        />
      )}
    </div>
  );
}

export default App;