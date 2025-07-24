import React, { useRef } from 'react';
import { Download, ArrowLeft, Mail, Phone, Linkedin, MapPin, Github, ExternalLink } from 'lucide-react';
import { formatDate, formatGraduationDate, generateFileName } from '../utils/aiGenerator';

const PreviewPanel = ({ userData, generatedContent, onBack }) => {
  const previewRef = useRef(null);

  const handleDownloadPDF = () => {
    const fileName = generateFileName(userData);
    document.title = fileName.replace('.pdf', '');
    window.print();
  };

  // Modern Resume Layout (ATS-Friendly)
  if (userData.documentType === 'Resume') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm p-3 print:hidden">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Form</span>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                Template: Modern ATS-Friendly | Type: {userData.documentType}
              </span>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 print:p-0">
          <div 
            ref={previewRef}
            className="bg-white shadow-lg mx-auto print:shadow-none print:mx-0"
            style={{
              fontFamily: "'Inter', 'Roboto', 'Open Sans', sans-serif",
              lineHeight: '1.15',
              height: '11.69in',
              width: '8.27in',
              margin: '0 auto',
              fontSize: '9px',
              color: '#1f2937',
              overflow: 'hidden',
              padding: '0.3in',
              boxSizing: 'border-box'
            }}
          >

            <div className="text-center mb-4 pb-2 border-b border-blue-600">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {userData.fullName}
              </h1>
              <h2 className="text-base font-semibold text-blue-600 mb-2">
                {userData.targetJobTitle}
              </h2>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{userData.location}</span>
                </div>
                {userData.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="w-3 h-3 mr-1" />
                    <span className="break-all">{userData.linkedin}</span>
                  </div>
                )}
                {userData.github && (
                  <div className="flex items-center">
                    <Github className="w-3 h-3 mr-1" />
                    <span className="break-all">{userData.github}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-1 border-b border-gray-300 pb-1">
                PROFESSIONAL SUMMARY
              </h3>
              <p className="text-xs leading-tight text-gray-700">
                {generatedContent.summary}
              </p>
            </div>

            {generatedContent.skills && (
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1 border-b border-gray-300 pb-1">
                  CORE COMPETENCIES
                </h3>
                <div className="grid grid-cols-3 gap-1">
                  {generatedContent.skills.technical?.slice(0, 9).map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {generatedContent.skills.soft?.slice(0, 6).map((skill, index) => (
                    <span key={index} className="bg-green-50 text-green-800 px-2 py-0.5 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {generatedContent.workExperience?.slice(0, 3).map((exp, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-sm font-bold text-gray-900 mb-1 border-b border-gray-300 pb-1">
                  PROFESSIONAL EXPERIENCE
                </h3>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-xs">{exp.jobTitle}</h4>
                    <p className="text-xs text-gray-700">{exp.company} | {exp.location}</p>
                  </div>
                  <span className="text-xs text-gray-600">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700 ml-3">
                  {exp.achievements.filter(ach => ach.trim()).slice(0, 3).map((achievement, achIndex) => (
                    <li key={achIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-1 border-b border-gray-300 pb-1">
                EDUCATION
              </h3>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-xs">{userData.degree}</h4>
                  <p className="text-xs text-gray-700">{userData.university}</p>
                  {userData.cgpa && (
                    <p className="text-xs text-gray-600">GPA: {userData.cgpa}/4.0</p>
                  )}
                </div>
                <span className="text-xs text-gray-600">
                  {formatGraduationDate(userData.graduationMonth, userData.graduationYear)}
                </span>
              </div>
            </div>

            {generatedContent.projects?.slice(0, 2).map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-sm font-bold text-gray-900 mb-1 border-b border-gray-300 pb-1">
                  RELEVANT PROJECTS
                </h3>
                <h4 className="font-bold text-xs">{project.title}</h4>
                <p className="text-xs text-gray-700">{project.description}</p>
                {project.technologies && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Technologies:</span> {project.technologies}
                  </p>
                )}
              </div>
            ))}

            {generatedContent.certifications?.slice(0, 3).map((cert, index) => (
              <div key={index} className="mb-3">
                <h3 className="text-sm font-bold text-gray-900 mb-1 border-b border-gray-300 pb-1">
                  CERTIFICATIONS
                </h3>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-700">
                  <li>{cert}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // CV Layout (Academic/Comprehensive with Sidebar)
  if (userData.documentType === 'CV') {
    const profileImageSrc = userData.profilePicture 
      ? URL.createObjectURL(userData.profilePicture)
      : `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm p-3 print:hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Form</span>
            </button>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                Template: {userData.template} | Type: {userData.documentType}
              </span>
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-none mx-auto p-1 print:p-0">
          <div 
            ref={previewRef}
            className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none print:p-0"
            style={{ 
              fontFamily: 'Georgia, serif',
              lineHeight: '1.1',
              minHeight: '11.69in',
              width: '9.27in',
              margin: '0 auto',
              fontSize: '9px',
              overflow: 'hidden'
            }}
          >

            <div className="flex h-full">
              <div 
                className="w-1/3 p-2 text-white"
                style={{ 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  minHeight: '11.69in'
                }}
              >

                <div className="text-center mb-3">
                  <div className="w-20 h-20 mx-auto mb-1 rounded-full border-2 border-white overflow-hidden">
                    <img
                      src={profileImageSrc}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-xs font-bold mb-1 border-b border-white pb-0.5">
                    Professional Summary
                  </h3>
                  <p className="text-xs leading-tight">
                    {generatedContent.summary}
                  </p>
                </div>

                <div className="mb-3">
                  <h3 className="text-xs font-bold mb-1 border-b border-white pb-0.5">
                    Contact Information
                  </h3>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span className="break-all">{userData.email}</span>
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
                        <span className="break-all">{userData.linkedin}</span>
                      </div>
                    )}
                    {userData.github && (
                      <div className="flex items-center space-x-1">
                        <Github className="w-3 h-3" />
                        <span className="break-all">{userData.github}</span>
                      </div>
                    )}
                  </div>
                </div>

                {generatedContent.skills && (
                  <div className="mb-3">
                    <h3 className="text-xs font-bold mb-1 border-b border-white pb-0.5">
                      Skills
                    </h3>
                    {[...(generatedContent.skills.technical || []).slice(0, 5), ...(generatedContent.skills.soft || []).slice(0, 3)].map((skill, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-white mr-1 text-xs">▶</span>
                        <span className="text-xs">{skill}</span>
                      </div>
                    ))}
                  </div>
                )}

                {generatedContent.languages?.slice(0, 3).map((language, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="text-xs font-bold mb-1 border-b border-white pb-0.5">
                      Languages
                    </h3>
                    <div className="flex items-center">
                      <span className="w-1 h-1 bg-white rounded-full mr-1"></span>
                      <span className="text-xs">{language}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-2/3 p-3 bg-white">
                <div className="mb-3 border-b border-blue-600 pb-1">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">
                    {userData.fullName}
                  </h1>
                  <h2 className="text-sm text-blue-600 font-semibold">
                    {userData.targetJobTitle || userData.degree}
                  </h2>
                </div>

                <div className="mb-2">
                  <h3 className="text-xs font-bold mb-1 text-blue-600 uppercase border-b border-blue-200 pb-0.5">
                    Education
                  </h3>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-xs">{userData.university}</h4>
                      <p className="text-xs text-gray-700">Degree: {userData.degree}</p>
                      {userData.cgpa && (
                        <p className="text-xs text-gray-700">CGPA: {userData.cgpa}/4.00</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">
                      {userData.graduationYear}
                    </span>
                  </div>
                </div>

                // Line 299: Reduced margin from mb-3 to mb-2 to save space
                {generatedContent.projects?.slice(0, 1).map((project, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="text-xs font-bold mb-1 text-blue-600 uppercase border-b border-blue-200 pb-0.5">
                      Research Project
                    </h3>
                    <h4 className="font-semibold text-xs">{project.title}</h4>
                    <p className="text-xs leading-tight">{project.description}</p>
                  </div>
                ))}

                // Line 310: Reduced work experiences from 2 to 1 to accommodate References section
                {generatedContent.workExperience?.slice(0, 1).map((exp, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="text-xs font-bold mb-1 text-blue-600 uppercase border-b border-blue-200 pb-0.5">
                      Experience
                    </h3>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-semibold text-xs">{exp.jobTitle}</h4>
                        <p className="text-xs text-gray-600">{exp.company} • {exp.location}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <ul className="text-xs space-y-0.5 ml-2">
                      {exp.achievements.filter(ach => ach.trim()).slice(0, 3).map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start">
                          <span className="text-gray-400 mr-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {generatedContent.certifications?.slice(0, 2).map((cert, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="text-xs font-bold mb-1 text-blue-600 uppercase border-b border-blue-200 pb-0.5">
                      Certifications
                    </h3>
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-1 text-xs">♦</span>
                      <span className="text-xs">{cert}</span>
                    </div>
                  </div>
                ))}

                {generatedContent.references?.slice(0, 2).map((ref, index) => (
                  <div key={index} className="mb-2">
                    <h3 className="text-xs font-bold mb-1 text-blue-600 uppercase border-b border-blue-200 pb-0.5">
                      References
                    </h3>
                    <div className="text-xs text-gray-700">
                      <p className="font-semibold">{ref.name}</p>
                      <p>{ref.relationship} | {ref.company}</p>
                      {ref.email && (
                        <p className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          <span>{ref.email}</span>
                        </p>
                      )}
                      {ref.phone && (
                        <p className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          <span>{ref.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Clean One-Page Resume Format
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm p-3 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Form</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">
              Template: {userData.template} | Type: {userData.documentType}
            </span>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 print:p-0">
        <div 
          ref={previewRef}
          className="bg-white shadow-lg mx-auto print:shadow-none print:mx-0"
          style={{
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.15',
            height: '11.69in',
            width: '8.27in',
            margin: '0 auto',
            fontSize: '9px',
            color: '#1f2937',
            overflow: 'hidden',
            padding: '0.3in',
            boxSizing: 'border-box'
          }}
        >

          <div className="text-center mb-4 pb-2 border-b border-gray-300">
            <h1 className="text-xl font-bold text-gray-900 mb-1 tracking-wide">
              {userData.fullName.toUpperCase()}
            </h1>
            {userData.targetJobTitle && (
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                {userData.targetJobTitle}
              </h2>
            )}
            <div className="flex justify-center flex-wrap gap-3 text-xs text-gray-600">
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

          {generatedContent.summary && (
            <div className="mb-3">
              <h3 className="text-xs font-bold mb-1 text-gray-900 uppercase border-b border-gray-300 pb-0.5">
                Professional Summary
              </h3>
              <p className="text-xs leading-tight text-gray-700">
                {generatedContent.summary}
              </p>
            </div>
          )}

          {generatedContent.skills && (
            <div className="mb-3">
              <h3 className="text-xs font-bold mb-1 text-gray-900 uppercase border-b border-gray-300 pb-0.5">
                Core Competencies
              </h3>
              <div className="grid grid-cols-3 gap-1">
                {[...(generatedContent.skills.technical || []).slice(0, 8), ...(generatedContent.skills.soft || []).slice(0, 4)].map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-1"></span>
                    <span className="text-xs">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedContent.workExperience?.slice(0, 3).map((exp, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xs font-bold mb-1 text-gray-900 uppercase border-b border-gray-300 pb-0.5">
                Professional Experience
              </h3>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-semibold text-xs">{exp.jobTitle}</h4>
                  <p className="text-xs text-gray-600">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <ul className="text-xs space-y-0.5 ml-2">
                {exp.achievements.filter(ach => ach.trim()).slice(0, 3).map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start">
                    <span className="text-gray-400 mr-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mb-3">
            <h3 className="text-xs font-bold mb-1 text-gray-900 uppercase border-b border-gray-300 pb-0.5">
              Education
            </h3>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-xs">{userData.degree}</h4>
                <p className="text-xs text-gray-600">{userData.university}</p>
                {userData.cgpa && (
                  <p className="text-xs text-gray-600">GPA: {userData.cgpa}/4.0</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {userData.graduationYear}
              </span>
            </div>
          </div>

          {generatedContent.projects?.slice(0, 2).map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xs font-bold mb-1 text-gray-900 uppercase border-b border-gray-300 pb-0.5">
                Projects
              </h3>
              <div className="flex items-center space-x-1 mb-1">
                <h4 className="font-semibold text-xs">{project.title}</h4>
                {project.link && (
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                )}
              </div>
              <p className="text-xs text-gray-700">{project.description}</p>
              {project.technologies && (
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Tools:</span> {project.technologies}
                </p>
              )}
            </div>
          ))}

          {generatedContent.certifications?.slice(0, 3).map((cert, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-xs font-bold mb-1 text-gray-900 uppercase border-b border-gray-300 pb-0.5">
                Certifications
              </h3>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-gray-600 rounded-full mr-1"></span>
                  <span className="text-xs">{cert}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;