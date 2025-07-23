import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Linkedin, Award, Briefcase, BookOpen, 
  Globe, FileText, Camera, Plus, Minus, ChevronDown, ChevronUp, 
  Github, Languages, Heart, GraduationCap, ArrowRight, ArrowLeft,
  CheckCircle, HelpCircle, AlertCircle, Save, Eye, Upload, X
} from 'lucide-react';
import AISummaryGenerator from './AISummaryGenerator';

// Simple UUID generator for unique keys
const generateId = () => Math.random().toString(36).substr(2, 9);

// Tooltip component - moved outside to prevent re-creation
const Tooltip = ({ id, text }) => (
  <div className="absolute z-10 -top-2 left-full ml-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg w-48">
    {text}
    <div className="absolute -left-1 top-3 w-2 h-2 bg-gray-800 transform rotate-45"></div>
  </div>
);

// Form Input component - moved outside to prevent re-creation
const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  required = false, 
  placeholder = '', 
  icon: Icon,
  tooltipText,
  formData,
  formErrors,
  handleInputChange,
  showTooltip,
  setShowTooltip
  // Remove ...rest entirely
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {Icon && <Icon className="inline w-4 h-4 mr-2 text-gray-500" />}
        {label} {required && <span className="text-red-500">*</span>}
        {tooltipText && (
          <button 
            type="button"
            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            onMouseEnter={() => setShowTooltip(name)}
            onMouseLeave={() => setShowTooltip('')}
            aria-label={`Help for ${label}`}
          >
            <HelpCircle className="w-3 h-3 inline" />
          </button>
        )}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border ${
            formErrors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm`}
        />
        {showTooltip === name && tooltipText && (
          <Tooltip id={`tooltip-${name}`} text={tooltipText} />
        )}
      </div>
      {formErrors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {formErrors[name]}
        </p>
      )}
    </div>
  );
};

// DynamicSection component - moved outside to prevent re-creation and focus loss
const DynamicSection = React.memo(({ 
  sectionName, 
  title, 
  dynamicData, 
  addItem, 
  removeItem, 
  updateItem, 
  updateObjectItem, 
  updateAchievement, 
  addAchievement, 
  removeAchievement 
}) => {
  if (dynamicData[sectionName].length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3" id={`section-${sectionName}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <button
          type="button"
          onClick={() => addItem(sectionName)}
          className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full transition-colors"
          aria-label={`Add ${title}`}
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>
      
      {sectionName === 'workExperience' ? (
        // Work Experience Section
        dynamicData[sectionName].map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">Experience {index + 1}</h5>
              {dynamicData[sectionName].length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(sectionName, item.id)}
                  className="p-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Remove experience"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.jobTitle}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'jobTitle', e.target.value)}
                  placeholder="e.g., Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'company', e.target.value)}
                  placeholder="e.g., ABC Company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={item.location}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'location', e.target.value)}
                  placeholder="e.g., Addis Ababa, Ethiopia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="space-y-2">
                  <input
                    type="month"
                    value={item.isCurrent ? '' : item.endDate}
                    onChange={(e) => updateObjectItem(sectionName, item.id, 'endDate', e.target.value)}
                    disabled={item.isCurrent}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm ${
                      item.isCurrent ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                  />
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.isCurrent || false}
                      onChange={(e) => updateObjectItem(sectionName, item.id, 'isCurrent', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">I currently work here</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Key Achievements</label>
                <button
                  type="button"
                  onClick={() => addAchievement(sectionName, item.id)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-xs bg-green-50 hover:bg-green-100 px-2 py-1 rounded-full transition-colors"
                  aria-label="Add achievement"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              {item.achievements.map((achievement, achIndex) => (
                <div key={achIndex} className="flex space-x-2 mb-2 group">
                  <div className="mt-2 text-gray-400 group-focus-within:text-green-600">•</div>
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => updateAchievement(sectionName, item.id, achIndex, e.target.value)}
                    placeholder="e.g., Increased sales by 25% through new marketing strategy"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                  />
                  {item.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAchievement(sectionName, item.id, achIndex)}
                      className="p-1 text-red-500 hover:text-red-700 self-center"
                      aria-label="Remove achievement"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      ) : sectionName === 'projects' ? (
        // Projects Section
        dynamicData[sectionName].map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">Project {index + 1}</h5>
              {dynamicData[sectionName].length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(sectionName, item.id)}
                  className="p-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Remove project"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'title', e.target.value)}
                  placeholder="e.g., Customer Satisfaction Survey"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link
                </label>
                <input
                  type="url"
                  value={item.link}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'link', e.target.value)}
                  placeholder="https://example.com/project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={item.description}
                onChange={(e) => updateObjectItem(sectionName, item.id, 'description', e.target.value)}
                placeholder="Brief project description (1-2 sentences)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies/Skills Used
              </label>
              <input
                type="text"
                value={item.technologies}
                onChange={(e) => updateObjectItem(sectionName, item.id, 'technologies', e.target.value)}
                placeholder="e.g., Excel, Project Management, Research"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
              />
            </div>
          </div>
        ))
      ) : sectionName === 'references' ? (
        // References Section
        dynamicData[sectionName].map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-800">Reference {index + 1}</h5>
              {dynamicData[sectionName].length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(sectionName, item.id)}
                  className="p-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Remove reference"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'name', e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'title', e.target.value)}
                  placeholder="e.g., Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'company', e.target.value)}
                  placeholder="e.g., ABC Company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={item.email}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'email', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={item.phone}
                  onChange={(e) => updateObjectItem(sectionName, item.id, 'phone', e.target.value)}
                  placeholder="+251 91 234 5678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        // Regular sections (Skills, Certifications, Languages, Hobbies)
        <div className="space-y-3">
          {dynamicData[sectionName].map((item, index) => (
            <div key={item.id} className="flex space-x-2 items-center group">
              <span className="text-gray-400 group-focus-within:text-green-600">
                {index + 1}.
              </span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateItem(sectionName, item.id, e.target.value)}
                placeholder={
                  sectionName === 'skills' 
                    ? "e.g., Communication, Leadership, Microsoft Office" 
                    : sectionName === 'certifications'
                    ? "e.g., Project Management Certification, First Aid Training"
                    : sectionName === 'languages'
                    ? "e.g., English (Fluent), Amharic (Native)"
                    : "e.g., Reading, Sports, Volunteering"
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
              />
              {dynamicData[sectionName].length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(sectionName, item.id)}
                  className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${sectionName} item`}
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(sectionName)}
            className="text-sm text-green-600 hover:text-green-800 flex items-center space-x-1 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add another</span>
          </button>
        </div>
      )}
    </div>
  );
});

const InputForm = ({ onSubmit, userData = {} }) => {
  // Form steps
  const steps = [
    { id: 'basics', title: 'Basic Info' },
    { id: 'education', title: 'Education' },
    { id: 'experience', title: 'Experience' },
    { id: 'skills', title: 'Skills & Extras' },
    { id: 'review', title: 'Review' }
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Default form data
  const [formData, setFormData] = useState({
    fullName: userData.fullName || '',
    email: userData.email || '',
    phone: userData.phone || '',
    linkedin: userData.linkedin || '',
    github: userData.github || '',
    location: userData.location || '',
    targetJobTitle: userData.targetJobTitle || '',
    jobDescription: userData.jobDescription || '',
    degree: userData.degree || '',
    university: userData.university || '',
    graduationYear: userData.graduationYear || '',
    graduationMonth: userData.graduationMonth || '',
    cgpa: userData.cgpa || '',
    department: userData.department || '',
    keyCourses: userData.keyCourses || '',
    exitExamScore: userData.exitExamScore || '',
    documentType: userData.documentType || 'Resume',
    template: userData.template || 'Simple',
    autoGenerateSummary: userData.autoGenerateSummary !== false,
    professionalSummary: userData.professionalSummary || '',
    profilePicture: userData.profilePicture || null
  });

  // Section visibility states
  const [sections, setSections] = useState({
    skills: false,
    workExperience: false,
    projects: false,
    certifications: false,
    languages: false,
    hobbies: false,
    references: false
  });

  // Dynamic lists for each section
  const [dynamicData, setDynamicData] = useState({
    skills: [],
    workExperience: [],
    projects: [],
    certifications: [],
    languages: [],
    hobbies: [],
    references: []
  });

  // Auto calculate form progress
  useEffect(() => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(val => val && val !== '').length;
    const dynamicFieldsCount = Object.values(dynamicData).flat().length;
    
    const progress = Math.min(100, Math.round((filledFields / (totalFields + dynamicFieldsCount)) * 100));
    setFormProgress(progress);
  }, [formData, dynamicData]);

  // Initialize sections when they are first opened
  const initializeSection = (sectionName) => {
    if (dynamicData[sectionName].length === 0) {
      let newItem;
      if (sectionName === 'workExperience') {
        newItem = { 
          id: generateId(), 
          jobTitle: '', 
          company: '', 
          location: '', 
          startDate: '', 
          endDate: '', 
          achievements: [''] 
        };
      } else if (sectionName === 'projects') {
        newItem = { 
          id: generateId(), 
          title: '', 
          description: '', 
          technologies: '', 
          link: '' 
        };
      } else if (sectionName === 'references') {
        newItem = { 
          id: generateId(), 
          name: '', 
          title: '', 
          company: '', 
          email: '', 
          phone: '' 
        };
      } else {
        newItem = { id: generateId(), value: '' };
      }
      
      setDynamicData(prev => ({
        ...prev,
        [sectionName]: [newItem]
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          profilePicture: 'File size must be less than 2MB'
        }));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          profilePicture: 'Please select a valid image file'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      // Clear any previous errors
      if (formErrors.profilePicture) {
        setFormErrors(prev => ({
          ...prev,
          profilePicture: null
        }));
      }
    }
  };

  const removeProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  const toggleSection = (sectionName) => {
    setSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
    
    // Initialize section when opened
    if (!sections[sectionName]) {
      initializeSection(sectionName);
    }
  };

  const addItem = (sectionName) => {
    setDynamicData(prev => {
      // Check if we have items and if the last one has content
      if (prev[sectionName].length > 0) {
        const lastItem = prev[sectionName][prev[sectionName].length - 1];
        let hasContent = false;
        
        if (sectionName === 'workExperience') {
          hasContent = lastItem.jobTitle.trim() || lastItem.company.trim();
        } else if (sectionName === 'projects') {
          hasContent = lastItem.title.trim() || lastItem.description.trim();
        } else if (sectionName === 'references') {
          hasContent = lastItem.name.trim() || lastItem.email.trim();
        } else {
          hasContent = lastItem.value.trim();
        }
        
        if (!hasContent) {
          return prev; // Don't add if last item is empty
        }
      }
      
      let newItem;
      if (sectionName === 'workExperience') {
        newItem = { 
          id: generateId(), 
          jobTitle: '', 
          company: '', 
          location: '', 
          startDate: '', 
          endDate: '', 
          achievements: [''] 
        };
      } else if (sectionName === 'projects') {
        newItem = { 
          id: generateId(), 
          title: '', 
          description: '', 
          technologies: '', 
          link: '' 
        };
      } else if (sectionName === 'references') {
        newItem = { 
          id: generateId(), 
          name: '', 
          title: '', 
          company: '', 
          email: '', 
          phone: '' 
        };
      } else {
        newItem = { id: generateId(), value: '' };
      }
      
      return {
        ...prev,
        [sectionName]: [...prev[sectionName], newItem]
      };
    });
  };

  const removeItem = (sectionName, itemId) => {
    setDynamicData(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (sectionName, itemId, value) => {
    setDynamicData(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item => 
        item.id === itemId ? { ...item, value } : item
      )
    }));
  };

  const updateObjectItem = (sectionName, itemId, field, value) => {
    setDynamicData(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateAchievement = (sectionName, itemId, achievementIndex, value) => {
    setDynamicData(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item => 
        item.id === itemId ? {
          ...item,
          achievements: item.achievements.map((ach, idx) => 
            idx === achievementIndex ? value : ach
          )
        } : item
      )
    }));
  };

  const addAchievement = (sectionName, itemId) => {
    setDynamicData(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item => 
        item.id === itemId ? {
          ...item,
          achievements: [...item.achievements, '']
        } : item
      )
    }));
  };

  const removeAchievement = (sectionName, itemId, achievementIndex) => {
    setDynamicData(prev => ({
      ...prev,
      [sectionName]: prev[sectionName].map(item => 
        item.id === itemId ? {
          ...item,
          achievements: item.achievements.filter((_, idx) => idx !== achievementIndex)
        } : item
      )
    }));
  };

  const handleCurrentPositionToggle = (sectionName, itemId, isCurrent) => {
    updateObjectItem(sectionName, itemId, 'endDate', isCurrent ? 'Present' : '');
    updateObjectItem(sectionName, itemId, 'isCurrent', isCurrent);
  };

  const validateStep = () => {
    const errors = {};
    
    if (currentStep === 0) {
      // Validate basic info
      if (!formData.fullName) errors.fullName = "Name is required";
      if (!formData.email) errors.email = "Email is required";
      if (!formData.phone) errors.phone = "Phone number is required";
      if (!formData.location) errors.location = "Location is required";
      if (formData.documentType === 'Resume' && !formData.targetJobTitle) {
        errors.targetJobTitle = "Job title is required for Resume";
      }
      if (formData.documentType === 'Resume' && !formData.jobDescription) {
        errors.jobDescription = "Job description is required for Resume tailoring";
      }
    } else if (currentStep === 1) {
      // Validate education
      if (!formData.degree) errors.degree = "Degree is required";
      if (!formData.university) errors.university = "Institution is required";
      if (!formData.graduationYear) errors.graduationYear = "Graduation year is required";
      if (!formData.graduationMonth) errors.graduationMonth = "Graduation month is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    // Combine dynamic data into form data
    const processedData = {
      ...formData,
      skills: dynamicData.skills.filter(skill => skill.value.trim()).map(skill => skill.value),
      workExperience: dynamicData.workExperience.filter(exp => exp.jobTitle.trim() || exp.company.trim()),
      projects: dynamicData.projects.filter(proj => proj.title.trim() || proj.description.trim()),
      certifications: dynamicData.certifications.filter(cert => cert.value.trim()).map(cert => cert.value),
      languages: dynamicData.languages.filter(lang => lang.value.trim()).map(lang => lang.value),
      hobbies: dynamicData.hobbies.filter(hobby => hobby.value.trim()).map(hobby => hobby.value),
      references: dynamicData.references.filter(ref => ref.name.trim() || ref.email.trim())
    };
    
    onSubmit(processedData);
  };

  const SectionToggle = ({ sectionName, title, icon: Icon, isOpen, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors shadow-sm group"
      aria-expanded={isOpen ? "true" : "false"}
      aria-controls={`section-${sectionName}`}
    >
      <div className="flex items-center space-x-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
          <Icon className="w-4 h-4" />
        </span>
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </span>
    </button>
  );

  // Format date to Month Year format
  const formatDateToMonthYear = (dateString) => {
    if (!dateString) return '';
    if (dateString === 'Present' || dateString === 'Current') return 'Present';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Form sections based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Let's start with the basics</h3>
              <p className="text-sm text-gray-600">
                We'll use this information to personalize your {formData.documentType.toLowerCase()}.
              </p>
            </div>
            
            {/* Document Type Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-2 text-gray-500" />
                  Document Type
                </label>
                <div className="flex space-x-3">
                  {['Resume', 'CV'].map(type => (
                    <label 
                      key={type}
                      className={`flex-1 flex items-center justify-center p-3 border ${
                        formData.documentType === type 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } rounded-lg cursor-pointer transition-colors text-sm font-medium`}
                    >
                      <input
                        type="radio"
                        name="documentType"
                        value={type}
                        checked={formData.documentType === type}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span>
                        {type === 'Resume' ? 'Resume (Job-focused)' : 'CV (Academic)'}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {formData.documentType === 'Resume' 
                    ? 'A resume is typically 1-page and focused on specific job requirements.'
                    : 'A CV is more comprehensive and includes academic achievements and publications.'}
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Style
                </label>
                <select
                  name="template"
                  value={formData.template}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="Simple">Simple</option>
                  <option value="Elegant">Elegant</option>
                  <option value="Professional">Professional</option>
                  <option value="Modern">Modern</option>
                  <option value="Creative">Creative</option>
                </select>
                
                <div className="mt-3 bg-gray-100 rounded-lg p-2 h-24 flex items-center justify-center">
                  <p className="text-xs text-gray-500 text-center">
                    Template preview will appear here
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  required
                  placeholder="Enter your full name"
                  icon={User}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                
                <FormInput
                  label="Target Job Title"
                  name="targetJobTitle"
                  required={formData.documentType === 'Resume'}
                  placeholder="e.g., Marketing Manager, Teacher"
                  icon={Briefcase}
                  tooltipText="For resumes, this should match the job you're applying for."
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>

              {/* Job Description for Resume */}
              {formData.documentType === 'Resume' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline w-4 h-4 mr-2 text-gray-500" />
                    Job Description <span className="text-red-500">*</span>
                    <button 
                      type="button"
                      className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onMouseEnter={() => setShowTooltip('jobDescription')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      <HelpCircle className="w-3 h-3 inline" />
                    </button>
                  </label>
                  <div className="relative">
                    <textarea
                      name="jobDescription"
                      value={formData.jobDescription || ''}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.jobDescription ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm`}
                      placeholder="Paste the complete job description here for optimal resume tailoring..."
                      rows={4}
                      required
                    />
                    {showTooltip === 'jobDescription' && (
                      <Tooltip 
                        id="tooltip-jobDescription" 
                        text="Paste the full job description to automatically tailor your resume with relevant keywords and skills that match the position requirements." 
                      />
                    )}
                  </div>
                  {formErrors.jobDescription && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.jobDescription}
                    </p>
                  )}
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Smart Resume Tailoring</p>
                        <p>Our AI will analyze this job description to:</p>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                          <li>Prioritize your most relevant skills and experience</li>
                          <li>Highlight achievements that match job requirements</li>
                          <li>Include industry-specific keywords for ATS optimization</li>
                          <li>Generate a targeted professional summary</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-generate summary option */}
              <div className="mt-4">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="autoGenerateSummary"
                    checked={formData.autoGenerateSummary !== false}
                    onChange={(e) => setFormData(prev => ({ ...prev, autoGenerateSummary: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span>Auto-generate professional summary based on my information</span>
                </label>
              </div>

              {/* Manual summary if auto-generate is disabled */}
              {formData.autoGenerateSummary === false && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Summary
                    <button 
                      type="button"
                      className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onMouseEnter={() => setShowTooltip('summary')}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      <HelpCircle className="w-3 h-3 inline" />
                    </button>
                  </label>
                  <div className="relative">
                    <textarea
                      name="professionalSummary"
                      value={formData.professionalSummary || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                      placeholder="Write a 2-3 sentence professional summary..."
                      rows={3}
                    />
                    {showTooltip === 'summary' && (
                      <Tooltip 
                        id="tooltip-summary" 
                        text="A strong summary highlights your key qualifications and career goals in 2-3 sentences." 
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  icon={Mail}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                
                <FormInput
                  label="Phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+251 91 234 5678"
                  icon={Phone}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                
                <FormInput
                  label="Location"
                  name="location"
                  required
                  placeholder="City, Country"
                  icon={Globe}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                
                <FormInput
                  label="LinkedIn"
                  name="linkedin"
                  type="url"
                  placeholder="linkedin.com/in/yourprofile"
                  icon={Linkedin}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
                
                <FormInput
                  label="GitHub/Portfolio"
                  name="github"
                  type="url"
                  placeholder="github.com/yourusername"
                  icon={Github}
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
            </div>

            {/* Profile Picture Upload - Only for CV */}
            {formData.documentType === 'CV' && (
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-green-600" />
                  Profile Picture (Optional)
                </h3>
                
                <div className="flex items-center space-x-4">
                  {formData.profilePicture ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData.profilePicture)}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <div className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg border border-green-200 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {formData.profilePicture ? 'Change Picture' : 'Upload Picture'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                    {formErrors.profilePicture && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {formErrors.profilePicture}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 1: // Education
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Education Details</h3>
              <p className="text-sm text-gray-600">
                Tell us about your educational background.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                Main Education
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Degree/Qualification"
                  name="degree"
                  required
                  placeholder="e.g., Bachelor of Business Administration"
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                  tooltipText="Include your highest or most relevant educational qualification."
                />
                
                <FormInput
                  label="Institution"
                  name="university"
                  required
                  placeholder="e.g., Addis Ababa University"
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Date <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="graduationMonth"
                      value={formData.graduationMonth}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.graduationMonth ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm`}
                      required
                    >
                      <option value="">Month</option>
                      <option value="01">January</option>
                      <option value="02">February</option>
                      <option value="03">March</option>
                      <option value="04">April</option>
                      <option value="05">May</option>
                      <option value="06">June</option>
                      <option value="07">July</option>
                      <option value="08">August</option>
                      <option value="09">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      placeholder="Year"
                      min="1990"
                      max="2030"
                      className={`w-full px-3 py-2 border ${
                        formErrors.graduationYear ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm`}
                      required
                    />
                  </div>
                  {(formErrors.graduationMonth || formErrors.graduationYear) && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.graduationMonth || formErrors.graduationYear}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA
                  </label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    placeholder="3.50"
                    min="2.00"
                    max="4.00"
                    step="0.01"
                    icon={Award}
                    formData={formData}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                    tooltipText="Include if your GPA is 3.0 or higher."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major/Field
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Business Administration"
                    icon={BookOpen}
                    formData={formData}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
              </div>
              
              {formData.documentType === 'CV' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exit Exam Score
                    </label>
                    <input
                      type="number"
                      name="exitExamScore"
                      value={formData.exitExamScore}
                      onChange={handleInputChange}
                      placeholder="e.g., 85"
                      min="0"
                      max="100"
                      icon={Award}
                      formData={formData}
                      formErrors={formErrors}
                      handleInputChange={handleInputChange}
                      showTooltip={showTooltip}
                      setShowTooltip={setShowTooltip}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="inline w-4 h-4 mr-2 text-gray-500" />
                  {formData.documentType === 'CV' ? 'Key Courses' : 'Relevant Coursework'}
                  <button 
                    type="button"
                    className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onMouseEnter={() => setShowTooltip('courses')}
                    onMouseLeave={() => setShowTooltip('')}
                  >
                    <HelpCircle className="w-3 h-3 inline" />
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="keyCourses"
                    value={formData.keyCourses}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm shadow-sm"
                    placeholder="e.g., Financial Analysis, Marketing Strategy, Computer Skills"
                  />
                  {showTooltip === 'courses' && (
                    <Tooltip 
                      id="tooltip-courses" 
                      text="List 3-5 courses most relevant to the position you're targeting." 
                    />
                  )}
                </div>
              </div>
              
              {/* Add additional education button */}
              <div className="mt-6">
                <button
                  type="button"
                  className="flex items-center text-sm text-green-600 hover:text-green-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add another education (coming soon)
                </button>
              </div>
            </div>
          </div>
        );
        
      case 2: // Experience
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Work Experience {formData.documentType === 'Resume' ? '' : '& Internships'}
              </h3>
              <p className="text-sm text-gray-600">
                {formData.documentType === 'Resume' 
                  ? 'Add your relevant work experience, starting with the most recent.'
                  : 'Include any internships, research positions, or volunteer work.'}
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <SectionToggle
                sectionName="workExperience"
                title={formData.documentType === 'Resume' ? 'Work Experience' : 'Experience & Internships'}
                icon={Briefcase}
                isOpen={true}
                onToggle={() => {}}
              />
              <div className="mt-4">
                {dynamicData.workExperience.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">No experience added yet</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {formData.documentType === 'Resume'
                        ? "Add your work history to strengthen your application."
                        : "Even internships or volunteer work can make your CV stand out."}
                    </p>
                    <button
                      type="button"
                      onClick={() => initializeSection('workExperience')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Experience
                    </button>
                  </div>
                ) : (
                  <DynamicSection
                    sectionName="workExperience"
                    title={formData.documentType === 'Resume' ? 'Work Experience' : 'Experience & Internships'}
                    dynamicData={dynamicData}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    updateObjectItem={updateObjectItem}
                    updateAchievement={updateAchievement}
                    addAchievement={addAchievement}
                    removeAchievement={removeAchievement}
                  />
                )}
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <SectionToggle
                sectionName="projects"
                title={formData.documentType === 'Resume' ? 'Projects' : 'Research Projects'}
                icon={BookOpen}
                isOpen={sections.projects}
                onToggle={() => toggleSection('projects')}
              />
              {sections.projects && (
                <div className="mt-4">
                  <DynamicSection
                    sectionName="projects"
                    title={formData.documentType === 'Resume' ? 'Projects' : 'Research Projects'}
                    dynamicData={dynamicData}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    updateObjectItem={updateObjectItem}
                    updateAchievement={updateAchievement}
                    addAchievement={addAchievement}
                    removeAchievement={removeAchievement}
                  />
                </div>
              )}
            </div>
          </div>
        );
        
      case 3: // Skills & Extra sections
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Skills & Additional Information</h3>
              <p className="text-sm text-gray-600">
                Add any skills, certifications, languages, and other details to make your {formData.documentType.toLowerCase()} stand out.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <SectionToggle
                sectionName="skills"
                title={formData.documentType === 'Resume' ? 'Skills' : 'Technical Skills'}
                icon={Award}
                isOpen={true}
                onToggle={() => {}}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                {dynamicData.skills.length === 0 ? (
                  <div className="text-center py-6">
                    <Award className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <h4 className="text-base font-medium text-gray-700 mb-2">Add your skills</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Include both technical and soft skills relevant to your target role.
                    </p>
                    <button
                      type="button"
                      onClick={() => initializeSection('skills')}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Skills
                    </button>
                  </div>
                ) : (
                  <DynamicSection
                    sectionName="skills"
                    title={formData.documentType === 'Resume' ? 'Skills' : 'Technical Skills'}
                    dynamicData={dynamicData}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    updateObjectItem={updateObjectItem}
                    updateAchievement={updateAchievement}
                    addAchievement={addAchievement}
                    removeAchievement={removeAchievement}
                  />
                )}
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <SectionToggle
                sectionName="certifications"
                title="Certifications & Training"
                icon={Award}
                isOpen={sections.certifications}
                onToggle={() => toggleSection('certifications')}
              />
              {sections.certifications && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <DynamicSection
                    sectionName="certifications"
                    title="Certifications & Training"
                    dynamicData={dynamicData}
                    addItem={addItem}
                    removeItem={removeItem}
                    updateItem={updateItem}
                    updateObjectItem={updateObjectItem}
                    updateAchievement={updateAchievement}
                    addAchievement={addAchievement}
                    removeAchievement={removeAchievement}
                  />
                </div>
              )}
            </div>

            {/* Languages - CV Only */}
            {formData.documentType === 'CV' && (
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <SectionToggle
                  sectionName="languages"
                  title="Languages"
                  icon={Languages}
                  isOpen={sections.languages}
                  onToggle={() => toggleSection('languages')}
                />
                {sections.languages && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <DynamicSection
                      sectionName="languages"
                      title="Languages"
                      dynamicData={dynamicData}
                      addItem={addItem}
                      removeItem={removeItem}
                      updateItem={updateItem}
                      updateObjectItem={updateObjectItem}
                      updateAchievement={updateAchievement}
                      addAchievement={addAchievement}
                      removeAchievement={removeAchievement}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Hobbies - CV Only */}
            {formData.documentType === 'CV' && (
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <SectionToggle
                  sectionName="hobbies"
                  title="Hobbies & Interests"
                  icon={Heart}
                  isOpen={sections.hobbies}
                  onToggle={() => toggleSection('hobbies')}
                />
                {sections.hobbies && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <DynamicSection
                      sectionName="hobbies"
                      title="Hobbies & Interests"
                      dynamicData={dynamicData}
                      addItem={addItem}
                      removeItem={removeItem}
                      updateItem={updateItem}
                      updateObjectItem={updateObjectItem}
                      updateAchievement={updateAchievement}
                      addAchievement={addAchievement}
                      removeAchievement={removeAchievement}
                    />
                  </div>
                )}
              </div>
            )}

            {/* References - CV Only */}
            {formData.documentType === 'CV' && (
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <SectionToggle
                  sectionName="references"
                  title="References"
                  icon={User}
                  isOpen={sections.references}
                  onToggle={() => toggleSection('references')}
                />
                {sections.references && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <DynamicSection
                      sectionName="references"
                      title="References"
                      dynamicData={dynamicData}
                      addItem={addItem}
                      removeItem={removeItem}
                      updateItem={updateItem}
                      updateObjectItem={updateObjectItem}
                      updateAchievement={updateAchievement}
                      addAchievement={addAchievement}
                      removeAchievement={removeAchievement}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 4: // Review
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Review Your Information</h3>
              <p className="text-sm text-gray-600">
                Please review all the information you've provided before generating your {formData.documentType.toLowerCase()}.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Personal Info
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-gray-600">Name:</span> {formData.fullName || '—'}</li>
                  <li><span className="text-gray-600">Email:</span> {formData.email || '—'}</li>
                  <li><span className="text-gray-600">Phone:</span> {formData.phone || '—'}</li>
                  <li><span className="text-gray-600">Location:</span> {formData.location || '—'}</li>
                  <li><span className="text-gray-600">Target Role:</span> {formData.targetJobTitle || '—'}</li>
                </ul>
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(0)}
                  className="mt-3 text-green-600 text-sm hover:text-green-800"
                >
                  Edit
                </button>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                  Education
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-gray-600">Degree:</span> {formData.degree || '—'}</li>
                  <li><span className="text-gray-600">Institution:</span> {formData.university || '—'}</li>
                  <li><span className="text-gray-600">Graduation:</span> {formatDateToMonthYear(`${formData.graduationMonth}/${formData.graduationYear}`) || '—'}</li>
                  <li><span className="text-gray-600">GPA:</span> {formData.cgpa || '—'}</li>
                </ul>
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(1)}
                  className="mt-3 text-green-600 text-sm hover:text-green-800"
                >
                  Edit
                </button>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Skills & Extras
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-gray-600">Skills:</span> {dynamicData.skills.length > 0 ? 
                      `${dynamicData.skills.length} skills added` : '—'}
                  </li>
                  <li>
                    <span className="text-gray-600">Experience:</span> {dynamicData.workExperience.length > 0 ? 
                      `${dynamicData.workExperience.length} items added` : '—'}
                  </li>
                  <li>
                    <span className="text-gray-600">Projects:</span> {dynamicData.projects.length > 0 ? 
                      `${dynamicData.projects.length} items added` : '—'}
                  </li>
                </ul>
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(3)}
                  className="mt-3 text-green-600 text-sm hover:text-green-800"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                  {formData.documentType} Preview
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Preview Your {formData.documentType}</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      See how your {formData.documentType.toLowerCase()} will look before generating it.
                    </p>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      {previewMode ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-2 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Build Your Professional {formData.documentType}
            </h2>
            
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-500">Progress:</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{formProgress}%</span>
            </div>
          </div>
          
          {/* Steps Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto py-2 px-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    if (index <= currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                  disabled={index > currentStep}
                  className={`flex items-center mr-1 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    index === currentStep
                      ? 'bg-green-600 text-white font-medium'
                      : index < currentStep
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-20 mr-2 text-xs">
                    {index + 1}
                  </span>
                  {step.title}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {renderStepContent()}
            
            <div className="mt-8 flex justify-between items-center">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors ml-auto"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-base font-medium transition-colors ml-auto"
                >
                  Generate {formData.documentType}
                  <FileText className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <button type="button" className="text-green-600 hover:text-green-800 font-medium">
            <Save className="w-4 h-4 inline mr-1" />
            Save progress for later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;