import React, { useRef } from 'react';
import { Download, ArrowLeft, Mail, Phone, Linkedin, MapPin, Github, ExternalLink } from 'lucide-react';
import { formatDate, formatGraduationDate, generateFileName } from '../utils/aiGenerator';

const PreviewPanel = ({ userData, generatedContent, onBack }) => {
  const previewRef = useRef(null);

  const handleDownloadPDF = () => {
    // Set document title for PDF generation
    const fileName = generateFileName(userData);
    document.title = fileName.replace('.pdf', '');
    window.print();
  };

  // Modern Resume Layout (ATS-Friendly)
  if (userData.documentType === 'Resume') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 print:hidden">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Form</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Template: Modern ATS-Friendly | Type: {userData.documentType}
              </span>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="max-w-4xl mx-auto p-6 print:p-0">
          <div 
            ref={previewRef}
            className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none print:p-6"
            style={{ 
              fontFamily: "'Inter', 'Roboto', 'Open Sans', sans-serif",
              lineHeight: '1.5',
              minHeight: '11in',
              width: '8.5in',
              margin: '0 auto',
              fontSize: '11px',
              color: '#1f2937'
            }}
          >
            {/* Header Section */}
            <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userData.fullName}
              </h1>
              <h2 className="text-xl text-blue-600 font-semibold mb-3">
                {userData.targetJobTitle}
              </h2>
              
              {/* Contact Info */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{userData.location}</span>
                </div>
                {userData.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-4 h-4 mr-1" />
                    <span className="break-all">{userData.linkedin}</span>
                  </div>
                )}
                {userData.github && (
                  <div className="flex items-center">
                    <Github className="w-4 h-4 mr-1" />
                    <span className="break-all">{userData.github}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                PROFESSIONAL SUMMARY
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {generatedContent.summary}
              </p>
            </div>

            {/* Skills Section */}
            {generatedContent.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                  CORE COMPETENCIES
                </h3>
                
                {/* Technical Skills */}
                {generatedContent.skills.technical && generatedContent.skills.technical.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-800 mb-2">Technical Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.skills.technical.map((skill, index) => (
                        <span key={index} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Soft Skills */}
                {generatedContent.skills.soft && generatedContent.skills.soft.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Professional Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.skills.soft.map((skill, index) => (
                        <span key={index} className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Section */}
            {generatedContent.workExperience && generatedContent.workExperience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                  PROFESSIONAL EXPERIENCE
                </h3>
                {generatedContent.workExperience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{exp.jobTitle}</h4>
                        <p className="text-gray-700 font-medium">{exp.company} | {exp.location}</p>
                      </div>
                      <span className="text-gray-600 font-medium text-sm">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                      {exp.achievements.filter(ach => ach.trim()).map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                EDUCATION
              </h3>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">{userData.degree}</h4>
                  <p className="text-gray-700">{userData.university}</p>
                  {userData.cgpa && (
                    <p className="text-gray-600 text-sm">GPA: {userData.cgpa}/4.0</p>
                  )}
                </div>
                <span className="text-gray-600 font-medium">
                  {formatGraduationDate(userData.graduationMonth, userData.graduationYear)}
                </span>
              </div>
            </div>

            {/* Projects */}
            {generatedContent.projects && generatedContent.projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                  RELEVANT PROJECTS
                </h3>
                {generatedContent.projects.map((project, index) => (
                  <div key={index} className="mb-3">
                    <h4 className="font-bold text-gray-900">{project.title}</h4>
                    <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                    {project.technologies && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Technologies:</span> {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {generatedContent.certifications && generatedContent.certifications.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                  CERTIFICATIONS
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {generatedContent.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render CV format (Academic/Comprehensive format with sidebar)
  if (userData.documentType === 'CV') {
    const profileImageSrc = userData.profilePicture 
      ? URL.createObjectURL(userData.profilePicture)
      : `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`;

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 print:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Form</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Template: {userData.template} | Type: {userData.documentType}
              </span>
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* CV Preview Content - Academic format with sidebar */}
        <div className="max-w-none mx-auto p-1 print:p-0">
          <div 
            ref={previewRef}
            className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none print:p-0"
            style={{ 
              fontFamily: 'Georgia, serif',
              lineHeight: '1.2',
              minHeight: '11.7in',
              width: '10.5in',
              margin: '0 auto',
              fontSize: '10px'
            }}
          >
            <div className="flex h-full">
              {/* Left Sidebar - Dark Blue */}
              <div 
                className="w-2/5 p-3 text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  minHeight: '11.7in'
                }}
              >
                {/* Profile Picture */}
                <div className="text-center mb-4">
                  <div className="w-24 h-24 mx-auto mb-2 rounded-full border-3 border-white overflow-hidden">
                    <img
                      src={profileImageSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold mb-2 border-b-2 border-white pb-1">
                    Professional Summary
                  </h3>
                  <p className="text-xs leading-snug">
                    {generatedContent.summary}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold mb-2 border-b-2 border-white pb-1">
                    Contact Information
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="break-all text-xs">{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{userData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{userData.location}</span>
                    </div>
                    {userData.linkedin && (
                      <div className="flex items-center space-x-2">
                        <Linkedin className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs break-all">{userData.linkedin}</span>
                      </div>
                    )}
                    {userData.github && (
                      <div className="flex items-center space-x-2">
                        <Github className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs break-all">{userData.github}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {generatedContent.skills && generatedContent.skills.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2 border-b-2 border-white pb-1">
                      Skills
                    </h3>
                    <div className="space-y-1">
                      {generatedContent.skills.map((skill, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-white mr-2 text-xs">▶</span>
                          <span className="text-xs leading-tight">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {generatedContent.languages && generatedContent.languages.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2 border-b-2 border-white pb-1">
                      Languages
                    </h3>
                    <div className="space-y-1">
                      {generatedContent.languages.map((language, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-white rounded-full mr-2"></span>
                          <span className="text-xs">{language}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hobbies */}
                {generatedContent.hobbies && generatedContent.hobbies.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold mb-2 border-b-2 border-white pb-1">
                      Hobbies
                    </h3>
                    <div className="space-y-1">
                      {generatedContent.hobbies.map((hobby, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-white mr-2 text-xs">▶</span>
                          <span className="text-xs">{hobby}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Content Area */}
              <div className="w-3/5 p-4 bg-white">
                {/* Header with Name */}
                <div className="mb-4 border-b-2 border-blue-600 pb-2">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {userData.fullName}
                  </h1>
                  <h2 className="text-lg text-blue-600 font-semibold">
                    {userData.targetJobTitle || userData.degree}
                  </h2>
                </div>

                {/* Education */}
                <div className="mb-4">
                  <h3 className="text-base font-bold mb-2 text-blue-600 uppercase tracking-wide border-b border-blue-200 pb-1">
                    Education
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{userData.university}</h4>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Degree:</span> {userData.degree}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Graduation:</span> {userData.graduationYear}
                          </p>
                          {userData.cgpa && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">CGPA:</span> {userData.cgpa}/4.00
                            </p>
                          )}
                          {userData.exitExamScore && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">National Exit Exam Score:</span> {userData.exitExamScore}%
                            </p>
                          )}
                          {userData.keyCourses && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Key Courses:</span> {userData.keyCourses}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Research Projects */}
                {generatedContent.projects && generatedContent.projects.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-blue-600 uppercase tracking-wide border-b border-blue-200 pb-1">
                      Research Project
                    </h3>
                    {generatedContent.projects.slice(0, 1).map((project, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex items-center space-x-1 mb-1">
                          <span className="text-white text-xs">✓</span>
                          <h4 className="font-semibold text-xs">{project.title}</h4>
                        </div>
                        <p className="text-xs leading-tight ml-3">{project.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience */}
                {generatedContent.workExperience && generatedContent.workExperience.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-blue-600 uppercase tracking-wide border-b border-blue-200 pb-1">
                      Experience
                    </h3>
                    {generatedContent.workExperience.map((exp, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-semibold text-sm">{exp.jobTitle}</h4>
                            <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </span>
                        </div>
                        <ul className="text-sm space-y-0.5 ml-3">
                          {exp.achievements.filter(ach => ach.trim()).map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-start">
                              <span className="text-gray-400 mr-2">•</span>
                              <span className="leading-tight">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications & Training */}
                {generatedContent.certifications && generatedContent.certifications.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-blue-600 uppercase tracking-wide border-b border-blue-200 pb-1">
                      Certifications & Training
                    </h3>
                    <div className="space-y-1">
                      {generatedContent.certifications.map((cert, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2 text-sm">♦</span>
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {generatedContent.references && generatedContent.references.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-base font-bold mb-2 text-blue-600 uppercase tracking-wide border-b border-blue-200 pb-1">
                      Reference
                    </h3>
                    {generatedContent.references.slice(0, 2).map((ref, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-sm">
                          <span className="font-semibold">• {ref.name} ({ref.title}):</span> {ref.company}
                        </p>
                        <p className="text-sm text-gray-600 ml-2">
                          📧 Email: {ref.email} | 📞 Phone: {ref.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Clean One-Page Resume Format (Job-focused)
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Form</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Template: {userData.template} | Type: {userData.documentType}
            </span>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview Content - Clean One-Page Format */}
      <div className="max-w-4xl mx-auto p-6 print:p-0">
        <div 
          ref={previewRef}
          className="bg-white shadow-lg rounded-lg print:shadow-none print:rounded-none p-8 print:p-6"
          style={{ 
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.5',
            minHeight: '11in',
            width: '8.5in',
            margin: '0 auto',
            fontSize: '11px'
          }}
        >
          {/* Header Section */}
          <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
            <h1 className="text-2xl font-bold mb-2 text-gray-900 tracking-wide">
              {userData.fullName.toUpperCase()}
            </h1>
            {userData.targetJobTitle && (
              <h2 className="text-lg text-gray-700 font-medium mb-3">
                {userData.targetJobTitle}
              </h2>
            )}
            
            {/* Contact Information */}
            <div className="flex justify-center items-center flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{userData.location}</span>
              </div>
              {userData.linkedin && (
                <div className="flex items-center space-x-1">
                  <Linkedin className="w-3 h-3" />
                  <span className="text-xs">LinkedIn</span>
                </div>
              )}
              {userData.github && (
                <div className="flex items-center space-x-1">
                  <Github className="w-3 h-3" />
                  <span className="text-xs">Portfolio</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {generatedContent.summary && (
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Professional Summary
              </h3>
              <p className="text-xs leading-relaxed text-gray-700">
                {generatedContent.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {generatedContent.skills && generatedContent.skills.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Core Competencies
              </h3>
              <div className="grid grid-cols-3 gap-1">
                {generatedContent.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                    <span className="text-xs">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {generatedContent.workExperience && generatedContent.workExperience.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Professional Experience
              </h3>
              {generatedContent.workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold text-xs">{exp.jobTitle}</h4>
                      <p className="text-xs text-gray-600">{exp.company} • {exp.location}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <ul className="text-xs space-y-0.5 ml-3">
                    {exp.achievements.filter(ach => ach.trim()).map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="leading-tight">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          <div className="mb-5">
            <h3 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
              Education
            </h3>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h4 className="font-semibold text-xs">{userData.degree}</h4>
                <p className="text-xs text-gray-600">{userData.university}</p>
                {userData.cgpa && (
                  <p className="text-xs text-gray-600">GPA: {userData.cgpa}/4.0</p>
                )}
                {userData.keyCourses && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Relevant Coursework:</span> {userData.keyCourses}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {userData.graduationYear}
              </span>
            </div>
          </div>

          {/* Projects */}
          {generatedContent.projects && generatedContent.projects.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Projects & Relevant Experience
              </h3>
              {generatedContent.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-xs">{project.title}</h4>
                    {project.link && (
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-700 mb-1 leading-tight">{project.description}</p>
                  {project.technologies && (
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Tools/Skills:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {generatedContent.certifications && generatedContent.certifications.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold mb-2 text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
                Certifications & Training
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {generatedContent.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                    <span className="text-xs">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;