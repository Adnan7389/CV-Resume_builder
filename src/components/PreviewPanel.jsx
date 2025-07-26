import React, { useRef } from 'react';
import { Download, ArrowLeft, Mail, Phone, Linkedin, MapPin, Github } from 'lucide-react';
import { formatDate, formatGraduationDate, generateFileName } from '../utils/aiGenerator';

const PreviewPanel = ({ userData, generatedContent, onBack }) => {
  const previewRef = useRef(null);

  const handleDownloadPDF = () => {
    const fileName = generateFileName(userData).replace('.pdf', '');
    document.title = fileName;

    window.print();
  };

  // Modern Resume Layout (ATS-Friendly)
  if (userData.documentType === 'Resume') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm p-4 sm:p-6 print:hidden">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Back to Form</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">
                Template: Modern ATS-Friendly | Type: {userData.documentType}
              </span>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
          <div
            ref={previewRef}
            className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-[95%] md:max-w-4xl mx-auto overflow-auto min-h-[11in] resume-font print-a4"
          >
            <div className="text-center mb-6 border-b border-blue-600 pb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {userData.fullName}
              </h1>
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-blue-600 mb-3">
                {userData.targetJobTitle}
              </h2>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{userData.location}</span>
                </div>
                {userData.linkedin && (
                  <div className="flex items-center space-x-1">
                    <Linkedin className="w-4 h-4" />
                    <span className="break-all">{userData.linkedin}</span>
                  </div>
                )}
                {userData.github && (
                  <div className="flex items-center space-x-1">
                    <Github className="w-4 h-4" />
                    <span className="break-all">{userData.github}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                  PROFESSIONAL SUMMARY
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {generatedContent.summary}
                </p>
              </div>

              {generatedContent.skills && (
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                    CORE COMPETENCIES
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {generatedContent.skills.technical?.slice(0, 9).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {generatedContent.skills.soft?.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {generatedContent.workExperience?.slice(0, 3).map((exp, index) => (
                <div key={index}>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                    PROFESSIONAL EXPERIENCE
                  </h3>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">{exp.jobTitle}</h4>
                      <p className="text-xs sm:text-sm text-gray-700">{exp.company} | {exp.location}</p>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 ml-3">
                    {exp.achievements.filter((ach) => ach.trim()).slice(0, 3).map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                  EDUCATION
                </h3>
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">{userData.degree}</h4>
                    <p className="text-xs sm:text-sm text-gray-700">{userData.university}</p>
                    {userData.cgpa && (
                      <p className="text-xs sm:text-sm text-gray-600">GPA: {userData.cgpa}/4.0</p>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {formatGraduationDate(userData.graduationMonth, userData.graduationYear)}
                  </span>
                </div>
              </div>

              {generatedContent.projects?.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                    RELEVANT PROJECTS
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                    {generatedContent.projects.slice(0, 2).map((project, index) => (
                      <li key={index}>
                        <h4 className="font-bold">{project.title}</h4>
                        <p>{project.description}</p>
                        {project.technologies && (
                          <p className="text-gray-600">
                            <span className="font-medium">Technologies:</span> {project.technologies}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedContent.certifications?.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
                    CERTIFICATIONS
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700">
                    {generatedContent.certifications.slice(0, 3).map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
        <div className="bg-white shadow-sm p-4 sm:p-6 print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Back to Form</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-xs sm:text-sm text-gray-500">
                Template: {userData.template} | Type: {userData.documentType}
              </span>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm sm:text-base"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
          <div
            ref={previewRef}
            className="bg-white shadow-lg rounded-lg w-full max-w-[90%] sm:max-w-[95%] md:max-w-7xl mx-auto overflow-auto min-h-[11in] cv-font print-a4"
          >
            <div className="flex flex-col md:flex-row print:flex-row">
              <div className="w-full md:w-2/5 p-4 sm:p-6 text-white cv-sidebar">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full border-2 border-white overflow-hidden">
                    <img src={profileImageSrc} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold mb-2 border-b border-white pb-1">
                      Professional Summary
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed">{generatedContent.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold mb-2 border-b border-white pb-1">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span className="break-all">{userData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{userData.location}</span>
                      </div>
                      {userData.linkedin && (
                        <div className="flex items-center space-x-2">
                          <Linkedin className="w-4 h-4" />
                          <span className="break-all">{userData.linkedin}</span>
                        </div>
                      )}
                      {userData.github && (
                        <div className="flex items-center space-x-2">
                          <Github className="w-4 h-4" />
                          <span className="break-all">{userData.github}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {generatedContent.skills && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 border-b border-white pb-1">
                        Skills
                      </h3>
                      {[...(generatedContent.skills.technical || []).slice(0, 5), ...(generatedContent.skills.soft || []).slice(0, 3)].map(
                        (skill, index) => (
                          <div key={index} className="flex items-start text-xs sm:text-sm">
                            <span className="text-white mr-2">▶</span>
                            <span>{skill}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {generatedContent.languages?.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 border-b border-white pb-1">
                        Languages
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {generatedContent.languages.slice(0, 3).map((language, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                            <span>{language}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedContent.hobbies?.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 border-b border-white pb-1">
                        Hobbies
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {generatedContent.hobbies.slice(0, 4).map((hobby, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                            <span>{hobby}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-3/5 p-4 sm:p-6 bg-white">
                <div className="mb-4 sm:mb-6 border-b border-blue-600 pb-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {userData.fullName}
                  </h1>
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold text-blue-600">
                    {userData.targetJobTitle || userData.degree}
                  </h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold mb-2 text-blue-600 uppercase tracking-wide border-b border-blue-200 pb-1">
                      Education
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-xs sm:text-sm">{userData.university}</h4>
                            <p className="text-xs sm:text-sm text-gray-700">
                              <span className="font-medium">Degree:</span> {userData.degree}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-700">
                              <span className="font-medium">Graduation:</span>{' '}
                              {formatGraduationDate(userData.graduationMonth, userData.graduationYear)}
                            </p>
                            {userData.cgpa && (
                              <p className="text-xs sm:text-sm text-gray-700">
                                <span className="font-medium">CGPA:</span> {userData.cgpa}/4.00
                              </p>
                            )}
                            {userData.exitExamScore && (
                              <p className="text-xs sm:text-sm text-gray-700">
                                <span className="font-medium">National Exit Exam Score:</span>{' '}
                                {userData.exitExamScore}%
                              </p>
                            )}
                            {userData.keyCourses && (
                              <p className="text-xs sm:text-sm text-gray-700">
                                <span className="font-medium">Key Courses:</span> {userData.keyCourses}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {generatedContent.projects?.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 text-blue-600 uppercase border-b border-blue-200 pb-1">
                        Projects
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                        {generatedContent.projects.slice(0, 2).map((project, index) => (
                          <li key={index}>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p>{project.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedContent.workExperience?.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 text-blue-600 uppercase border-b border-blue-200 pb-1">
                        Experience
                      </h3>
                      {generatedContent.workExperience.slice(0, 1).map((exp, index) => (
                        <div key={index}>
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-xs sm:text-sm">{exp.jobTitle}</h4>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {exp.company} • {exp.location}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                            </span>
                          </div>
                          <ul className="text-xs sm:text-sm space-y-1 ml-3">
                            {exp.achievements
                              .filter((ach) => ach.trim())
                              .slice(0, 3)
                              .map((achievement, achIndex) => (
                                <li key={achIndex} className="flex items-start">
                                  <span className="text-gray-400 mr-2">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {generatedContent.certifications?.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 text-blue-600 uppercase border-b border-blue-200 pb-1">
                        Certifications & Trainings
                      </h3>
                      <ul className="text-xs sm:text-sm space-y-1 ml-3">
                        {generatedContent.certifications.slice(0, 2).map((cert, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">♦</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {generatedContent.references?.length > 0 && (
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2 text-blue-600 uppercase border-b border-blue-200 pb-1">
                        References
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                        {generatedContent.references.slice(0, 3).map((ref, index) => (
                          <li key={index}>
                            <p className="font-semibold">{ref.name}</p>
                            <p>{ref.title} | {ref.company}</p>
                            {ref.email && (
                              <p className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{ref.email}</span>
                              </p>
                            )}
                            {ref.phone && (
                              <p className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                <span>{ref.phone}</span>
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
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
      <div className="bg-white shadow-sm p-4 sm:p-6 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Form</span>
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-xs sm:text-sm text-gray-500">
              Template: {userData.template} | Type: {userData.documentType}
            </span>
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
        <div
          ref={previewRef}
          className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-[95%] md:max-w-4xl mx-auto overflow-auto min-h-[11in] onepage-font print-a4"
        >
          <div className="text-center mb-6 border-b border-gray-300 pb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-wide">
              {userData.fullName.toUpperCase()}
            </h1>
            {userData.targetJobTitle && (
              <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-700 mb-3">
                {userData.targetJobTitle}
              </h2>
            )}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{userData.location}</span>
              </div>
              {userData.linkedin && (
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">LinkedIn</span>
                </div>
              )}
              {userData.github && (
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">Portfolio</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {generatedContent.summary && (
              <div>
                <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 uppercase border-b border-gray-300 pb-1">
                  Professional Summary
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-700">
                  {generatedContent.summary}
                </p>
              </div>
            )}

            {generatedContent.skills && (
              <div>
                <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 uppercase border-b border-gray-300 pb-1">
                  Core Competencies
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[...(generatedContent.skills.technical || []).slice(0, 8), ...(generatedContent.skills.soft || []).slice(0, 4)].map(
                    (skill, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                        <span className="text-xs sm:text-sm">{skill}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {generatedContent.workExperience?.length > 0 && (
              <div>
                <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 uppercase border-b border-gray-300 pb-1">
                  Professional Experience
                </h3>
                {generatedContent.workExperience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm">{exp.jobTitle}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{exp.company} • {exp.location}</p>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-1 ml-3">
                      {exp.achievements
                        .filter((ach) => ach.trim())
                        .slice(0, 3)
                        .map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 uppercase border-b border-gray-300 pb-1">
                Education
              </h3>
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm">{userData.degree}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{userData.university}</p>
                  {userData.cgpa && (
                    <p className="text-xs sm:text-sm text-gray-600">GPA: {userData.cgpa}/4.0</p>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-gray-500">{userData.graduationYear}</span>
              </div>
            </div>

            {generatedContent.projects?.length > 0 && (
              <div>
                <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 uppercase border-b border-gray-300 pb-1">
                  Projects
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  {generatedContent.projects.slice(0, 2).map((project, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      <div>
                        <h4 className="font-semibold">{project.title}</h4>
                        <p>{project.description}</p>
                        {project.technologies && (
                          <p className="text-gray-600">
                            <span className="font-medium">Tools:</span> {project.technologies}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {generatedContent.certifications?.length > 0 && (
              <div>
                <h3 className="text-sm sm:text-base font-bold mb-2 text-gray-900 uppercase border-b border-gray-300 pb-1">
                  Certifications
                </h3>
                <ul className="text-xs sm:text-sm space-y-1 ml-3">
                  {generatedContent.certifications.slice(0, 3).map((cert, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;