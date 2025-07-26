import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, Linkedin, Award, Briefcase, BookOpen, 
  Globe, FileText, Camera, Plus, Minus, ChevronDown, ChevronUp, 
  Github, Languages, Heart, GraduationCap, ArrowRight, ArrowLeft,
  CheckCircle, HelpCircle, AlertCircle, Save, Eye, Upload, X, Loader2
} from 'lucide-react';
import AISummaryGenerator from './AISummaryGenerator';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Tooltip component
const Tooltip = ({ id, text }) => (
  <div className="absolute z-20 -top-10 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg w-64 transition-all duration-200">
    {text}
    <div className="absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-800 transform rotate-45"></div>
  </div>
);

// Enhanced FormInput component with floating labels
const FormInput = ({
  label,
  name,
  type = 'text',
  required = false,
  placeholder = '',
  icon: Icon,
  tooltipText,
  value,
  formErrors,
  handleInputChange,
  showTooltip,
  setShowTooltip,
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(!!value);
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(!!value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 border ${
            formErrors[name]
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 focus:border-blue-500'
          } rounded-lg focus:ring-2 focus:ring-blue-100 text-sm transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-transparent ${className}`}
          aria-invalid={formErrors[name] ? 'true' : 'false'}
          aria-describedby={formErrors[name] ? `error-${name}` : undefined}
        />
        <label
          className={`absolute left-10 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none ${
            isFocused || value ? 'top-2 text-xs text-gray-500' : 'text-gray-400'
          } ${formErrors[name] ? 'text-red-500' : ''}`}
          onClick={() => inputRef.current.focus()}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltipText && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onMouseEnter={() => setShowTooltip(name)}
            onMouseLeave={() => setShowTooltip('')}
            aria-label={`Help for ${label}`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      {showTooltip === name && tooltipText && (
        <Tooltip id={`tooltip-${name}`} text={tooltipText} />
      )}
      {formErrors[name] && (
        <p id={`error-${name}`} className="mt-1 text-xs text-red-500 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {formErrors[name]}
        </p>
      )}
    </div>
  );
};

// Enhanced DynamicSection with collapsible items
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
  removeAchievement,
  formErrors,
  showTooltip,
  setShowTooltip,
}) => {
  const [expandedItems, setExpandedItems] = useState({});

  if (dynamicData[sectionName].length === 0) {
    return null;
  }

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4" id={`section-${sectionName}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        <button
          type="button"
          onClick={() => addItem(sectionName)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add {title}</span>
        </button>
      </div>

      {sectionName === 'workExperience' ? (
        dynamicData[sectionName].map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <h5 className="font-semibold text-gray-800">
                {item.jobTitle || `Experience ${index + 1}`}
              </h5>
              <div className="flex items-center space-x-2">
                {dynamicData[sectionName].length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(sectionName, item.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
                <span className="text-gray-500">
                  {expandedItems[item.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </div>
            </button>

            {expandedItems[item.id] !== false && (
              <div className="p-4 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Job Title"
                    name={`jobTitle-${item.id}`}
                    required
                    placeholder="e.g., Marketing Manager"
                    value={item.jobTitle}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'jobTitle', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Company"
                    name={`company-${item.id}`}
                    required
                    placeholder="e.g., ABC Company"
                    value={item.company}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'company', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="Location"
                    name={`location-${item.id}`}
                    placeholder="e.g., Addis Ababa, Ethiopia"
                    value={item.location}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'location', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Start Date"
                    name={`startDate-${item.id}`}
                    type="month"
                    value={item.startDate}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'startDate', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <div>
                    <FormInput
                      label="End Date"
                      name={`endDate-${item.id}`}
                      type="month"
                      value={item.isCurrent ? '' : item.endDate}
                      formErrors={formErrors}
                      handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'endDate', e.target.value)}
                      disabled={item.isCurrent}
                      className={item.isCurrent ? 'bg-gray-100' : ''}
                      showTooltip={showTooltip}
                      setShowTooltip={setShowTooltip}
                    />
                    <label className="flex items-center space-x-2 mt-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.isCurrent || false}
                        onChange={(e) => updateObjectItem(sectionName, item.id, 'isCurrent', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-600">I currently work here</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Key Achievements</label>
                    <button
                      type="button"
                      onClick={() => addAchievement(sectionName, item.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Achievement</span>
                    </button>
                  </div>
                  {item.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex items-center space-x-2 mb-2 group">
                      <span className="text-gray-400 group-focus-within:text-blue-600">•</span>
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(sectionName, item.id, achIndex, e.target.value)}
                        placeholder="e.g., Increased sales by 25%"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all"
                      />
                      {item.achievements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAchievement(sectionName, item.id, achIndex)}
                          className="p-1 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : sectionName === 'projects' ? (
        dynamicData[sectionName].map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <h5 className="font-semibold text-gray-800">{item.title || `Project ${index + 1}`}</h5>
              <div className="flex items-center space-x-2">
                {dynamicData[sectionName].length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(sectionName, item.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
                <span className="text-gray-500">
                  {expandedItems[item.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </div>
            </button>

            {expandedItems[item.id] !== false && (
              <div className="p-4 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Project Title"
                    name={`title-${item.id}`}
                    required
                    placeholder="e.g., Customer Satisfaction Survey"
                    value={item.title}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'title', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Project Link"
                    name={`link-${item.id}`}
                    type="url"
                    placeholder="https://example.com/project"
                    value={item.link}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'link', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={item.description}
                    onChange={(e) => updateObjectItem(sectionName, item.id, 'description', e.target.value)}
                    placeholder="Brief project description (1-2 sentences)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all"
                    required
                  />
                </div>
                <FormInput
                  label="Technologies/Skills Used"
                  name={`technologies-${item.id}`}
                  placeholder="e.g., Excel, Project Management"
                  value={item.technologies}
                  formErrors={formErrors}
                  handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'technologies', e.target.value)}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
            )}
          </div>
        ))
      ) : sectionName === 'references' ? (
        dynamicData[sectionName].map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <h5 className="font-semibold text-gray-800">{item.name || `Reference ${index + 1}`}</h5>
              <div className="flex items-center space-x-2">
                {dynamicData[sectionName].length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(sectionName, item.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
                <span className="text-gray-500">
                  {expandedItems[item.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </div>
            </button>

            {expandedItems[item.id] !== false && (
              <div className="p-4 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Full Name"
                    name={`name-${item.id}`}
                    required
                    placeholder="e.g., John Smith"
                    value={item.name}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'name', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Job Title"
                    name={`title-${item.id}`}
                    placeholder="e.g., Manager"
                    value={item.title}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'title', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormInput
                    label="Company"
                    name={`company-${item.id}`}
                    placeholder="e.g., ABC Company"
                    value={item.company}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'company', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Email"
                    name={`email-${item.id}`}
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={item.email}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'email', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Phone"
                    name={`phone-${item.id}`}
                    type="tel"
                    placeholder="+251 91 234 5678"
                    value={item.phone}
                    formErrors={formErrors}
                    handleInputChange={(e) => updateObjectItem(sectionName, item.id, 'phone', e.target.value)}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="space-y-3">
          {dynamicData[sectionName].map((item, index) => (
            <div key={item.id} className="flex items-center space-x-2 group">
              <span className="text-gray-400 group-focus-within:text-blue-600 text-sm">{index + 1}.</span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateItem(sectionName, item.id, e.target.value)}
                placeholder={
                  sectionName === 'skills'
                    ? 'e.g., Communication, Leadership'
                    : sectionName === 'certifications'
                    ? 'e.g., Project Management Certification'
                    : sectionName === 'languages'
                    ? 'e.g., English (Fluent)'
                    : 'e.g., Reading, Sports'
                }
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all"
              />
              {dynamicData[sectionName].length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(sectionName, item.id)}
                  className="p-1 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(sectionName)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-2"
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
  const steps = [
    { id: 'basics', title: 'Basic Info' },
    { id: 'education', title: 'Education' },
    { id: 'experience', title: 'Experience' },
    { id: 'skills', title: 'Skills & Extras' },
    { id: 'review', title: 'Review' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    profilePicture: userData.profilePicture || null,
  });

  const [sections, setSections] = useState({
    skills: true,
    workExperience: true,
    projects: false,
    certifications: false,
    languages: false,
    hobbies: false,
    references: false,
  });

  const [dynamicData, setDynamicData] = useState({
    skills: [{ id: generateId(), value: '' }],
    workExperience: [
      {
        id: generateId(),
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        achievements: [''],
      },
    ],
    projects: [],
    certifications: [],
    languages: [],
    hobbies: [],
    references: [],
  });

  useEffect(() => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter((val) => val && val !== '').length;
    const dynamicFieldsCount = Object.values(dynamicData)
      .flat()
      .filter((item) => item.value || item.jobTitle || item.title || item.name)
      .length;
    const progress = Math.min(100, Math.round((filledFields + dynamicFieldsCount) / (totalFields + dynamicFieldsCount) * 100));
    setFormProgress(progress);
  }, [formData, dynamicData]);

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
          achievements: [''],
        };
      } else if (sectionName === 'projects') {
        newItem = {
          id: generateId(),
          title: '',
          description: '',
          technologies: '',
          link: '',
        };
      } else if (sectionName === 'references') {
        newItem = {
          id: generateId(),
          name: '',
          title: '',
          company: '',
          email: '',
          phone: '',
        };
      } else {
        newItem = { id: generateId(), value: '' };
      }

      setDynamicData((prev) => ({
        ...prev,
        [sectionName]: [newItem],
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (formErrors[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };
    switch (name) {
      case 'email':
        if (!value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (!value.match(/^\+?[\d\s-]{10,}$/)) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      case 'linkedin':
      case 'github':
        if (value && !value.match(/^https?:\/\/.+/)) {
          errors[name] = 'Please enter a valid URL';
        } else {
          delete errors[name];
        }
        break;
      case 'cgpa':
        if (value && (value < 2.0 || value > 4.0)) {
          errors.cgpa = 'GPA must be between 2.0 and 4.0';
        } else {
          delete errors.cgpa;
        }
        break;
      case 'exitExamScore':
        if (value && (value < 0 || value > 100)) {
          errors.exitExamScore = 'Score must be between 0 and 100';
        } else {
          delete errors.exitExamScore;
        }
        break;
      default:
        if (value.trim() === '') {
          errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else {
          delete errors[name];
        }
    }
    setFormErrors(errors);
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors((prev) => ({
          ...prev,
          profilePicture: 'File size must be less than 2MB',
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({
          ...prev,
          profilePicture: 'Please select a valid image file',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));

      setFormErrors((prev) => ({
        ...prev,
        profilePicture: null,
      }));
    }
  };

  const removeProfilePicture = () => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: null,
    }));
  };

  const toggleSection = (sectionName) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));

    if (!sections[sectionName]) {
      initializeSection(sectionName);
    }
  };

  const addItem = (sectionName) => {
    setDynamicData((prev) => {
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
          return prev;
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
          achievements: [''],
        };
      } else if (sectionName === 'projects') {
        newItem = {
          id: generateId(),
          title: '',
          description: '',
          technologies: '',
          link: '',
        };
      } else if (sectionName === 'references') {
        newItem = {
          id: generateId(),
          name: '',
          title: '',
          company: '',
          email: '',
          phone: '',
        };
      } else {
        newItem = { id: generateId(), value: '' };
      }

      return {
        ...prev,
        [sectionName]: [...prev[sectionName], newItem],
      };
    });
  };

  const removeItem = (sectionName, itemId) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].filter((item) => item.id !== itemId),
    }));
  };

  const updateItem = (sectionName, itemId, value) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((item) =>
        item.id === itemId ? { ...item, value } : item
      ),
    }));
  };

  const updateObjectItem = (sectionName, itemId, field, value) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateAchievement = (sectionName, itemId, achievementIndex, value) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((item) =>
        item.id === itemId
          ? {
              ...item,
              achievements: item.achievements.map((ach, idx) =>
                idx === achievementIndex ? value : ach
              ),
            }
          : item
      ),
    }));
  };

  const addAchievement = (sectionName, itemId) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((item) =>
        item.id === itemId
          ? {
              ...item,
              achievements: [...item.achievements, ''],
            }
          : item
      ),
    }));
  };

  const removeAchievement = (sectionName, itemId, achievementIndex) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((item) =>
        item.id === itemId
          ? {
              ...item,
              achievements: item.achievements.filter((_, idx) => idx !== achievementIndex),
            }
          : item
      ),
    }));
  };

  const validateStep = () => {
    const errors = {};

    if (currentStep === 0) {
      if (!formData.fullName) errors.fullName = 'Name is required';
      if (!formData.email || !formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        errors.email = 'Valid email is required';
      }
      if (!formData.phone || !formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
        errors.phone = 'Valid phone number is required';
      }
      if (!formData.location) errors.location = 'Location is required';
      if (formData.documentType === 'Resume' && !formData.targetJobTitle) {
        errors.targetJobTitle = 'Job title is required for Resume';
      }
      if (formData.documentType === 'Resume' && !formData.jobDescription) {
        errors.jobDescription = 'Job description is required for Resume';
      }
    } else if (currentStep === 1) {
      if (!formData.degree) errors.degree = 'Degree is required';
      if (!formData.university) errors.university = 'Institution is required';
      if (!formData.graduationYear) errors.graduationYear = 'Graduation year is required';
      if (!formData.graduationMonth) errors.graduationMonth = 'Graduation month is required';
    } else if (currentStep === 2) {
      dynamicData.workExperience.forEach((item, index) => {
        if (!item.jobTitle) errors[`jobTitle-${item.id}`] = `Job title is required for experience ${index + 1}`;
        if (!item.company) errors[`company-${item.id}`] = `Company is required for experience ${index + 1}`;
      });
      dynamicData.projects.forEach((item, index) => {
        if (!item.title) errors[`title-${item.id}`] = `Project title is required for project ${index + 1}`;
        if (!item.description) errors[`description-${item.id}`] = `Description is required for project ${index + 1}`;
      });
    } else if (currentStep === 3) {
      dynamicData.references.forEach((item, index) => {
        if (!item.name) errors[`name-${item.id}`] = `Name is required for reference ${index + 1}`;
        if (!item.email || !item.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
          errors[`email-${item.id}`] = `Valid email is required for reference ${index + 1}`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const processedData = {
        ...formData,
        skills: dynamicData.skills.filter((skill) => skill.value.trim()).map((skill) => skill.value),
        workExperience: dynamicData.workExperience.filter((exp) => exp.jobTitle.trim() || exp.company.trim()),
        projects: dynamicData.projects.filter((proj) => proj.title.trim() || proj.description.trim()),
        certifications: dynamicData.certifications.filter((cert) => cert.value.trim()).map((cert) => cert.value),
        languages: dynamicData.languages.filter((lang) => lang.value.trim()).map((lang) => lang.value),
        hobbies: dynamicData.hobbies.filter((hobby) => hobby.value.trim()).map((hobby) => hobby.value),
        references: dynamicData.references.filter((ref) => ref.name.trim() || ref.email.trim()),
      };

      await onSubmit(processedData);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setFormErrors({ submit: 'An error occurred while submitting. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionToggle = ({ sectionName, title, icon: Icon, isOpen, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all shadow-sm"
      aria-expanded={isOpen}
      aria-controls={`section-${sectionName}`}
    >
      <div className="flex items-center space-x-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 transition-all">
          <Icon className="w-5 h-5" />
        </span>
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
      </span>
    </button>
  );

  const formatDateToMonthYear = (dateString) => {
    if (!dateString || dateString === 'Present' || dateString === 'Current') return 'Present';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Let's Get Started</h3>
              <p className="text-sm text-gray-600">
                Build a professional {formData.documentType.toLowerCase()} with your personal information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Document Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
                    <div className="flex space-x-3">
                      {['Resume', 'CV'].map((type) => (
                        <label
                          key={type}
                          className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all text-sm font-medium ${
                            formData.documentType === type
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="documentType"
                            value={type}
                            checked={formData.documentType === type}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          {type === 'Resume' ? 'Resume (Job-focused)' : 'CV (Academic)'}
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {formData.documentType === 'Resume'
                        ? 'A concise 1-2 page document tailored for specific job applications.'
                        : 'A comprehensive document including academic achievements.'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Template Style</label>
                    <select
                      name="template"
                      value={formData.template}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all"
                    >
                      <option value="Simple">Simple</option>
                      <option value="Elegant">Elegant</option>
                      <option value="Professional">Professional</option>
                      <option value="Modern">Modern</option>
                      <option value="Creative">Creative</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    icon={User}
                    value={formData.fullName}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Target Job Title"
                    name="targetJobTitle"
                    required={formData.documentType === 'Resume'}
                    placeholder="e.g., Marketing Manager"
                    icon={Briefcase}
                    tooltipText="For resumes, this should match the job you're applying for."
                    value={formData.targetJobTitle}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  {formData.documentType === 'Resume' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Job Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          name="jobDescription"
                          value={formData.jobDescription || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-3 border ${
                            formErrors.jobDescription ? 'border-red-300 bg-red-50' : 'border-gray-200'
                          } rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all`}
                          placeholder="Paste the complete job description here..."
                          rows={4}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          onMouseEnter={() => setShowTooltip('jobDescription')}
                          onMouseLeave={() => setShowTooltip('')}
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        {showTooltip === 'jobDescription' && (
                          <Tooltip
                            id="tooltip-jobDescription"
                            text="Paste the full job description to tailor your resume with relevant keywords."
                          />
                        )}
                      </div>
                      {formErrors.jobDescription && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.jobDescription}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
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
                  value={formData.email}
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
                  value={formData.phone}
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
                  value={formData.location}
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
                  value={formData.linkedin}
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
                  value={formData.github}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
            </div>

            {formData.documentType === 'CV' && (
              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-blue-600" />
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-6">
                  {formData.profilePicture ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData.profilePicture)}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <div className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 transition-all">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm font-semibold">
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
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                    {formErrors.profilePicture && (
                      <p className="mt-2 text-xs text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.profilePicture}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Education Details</h3>
              <p className="text-sm text-gray-600">
                Provide your academic background to showcase your qualifications.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                Academic Background
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Degree/Qualification"
                    name="degree"
                    required
                    placeholder="e.g., Bachelor of Business Administration"
                    tooltipText="Include your highest or most relevant qualification."
                    value={formData.degree}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Institution"
                    name="university"
                    required
                    placeholder="e.g., Addis Ababa University"
                    value={formData.university}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Graduation Date <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="graduationMonth"
                        value={formData.graduationMonth}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-3 border ${
                          formErrors.graduationMonth ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        } rounded-lg focus:ring-2 focus:ring-blue-500 text-sm shadow-sm transition-all`}
                        required
                      >
                        <option value="">Month</option>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                          (month, idx) => (
                            <option key={month} value={String(idx + 1).padStart(2, '0')}>
                              {month}
                            </option>
                          )
                        )}
                      </select>
                      <FormInput
                        label="Year"
                        name="graduationYear"
                        type="number"
                        required
                        placeholder="Year"
                        min="1990"
                        max="2030"
                        value={formData.graduationYear}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        showTooltip={showTooltip}
                        setShowTooltip={setShowTooltip}
                      />
                    </div>
                    {(formErrors.graduationMonth || formErrors.graduationYear) && (
                      <p className="mt-2 text-xs text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.graduationMonth || formErrors.graduationYear}
                      </p>
                    )}
                  </div>
                  <FormInput
                    label="GPA"
                    name="cgpa"
                    type="number"
                    placeholder="3.50"
                    min="2.00"
                    max="4.00"
                    step="0.01"
                    tooltipText="Include if your GPA is 3.0 or higher."
                    value={formData.cgpa}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                  <FormInput
                    label="Major/Field"
                    name="department"
                    placeholder="e.g., Business Administration"
                    value={formData.department}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
                {formData.documentType === 'CV' && (
                  <FormInput
                    label="Exit Exam Score"
                    name="exitExamScore"
                    type="number"
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                    value={formData.exitExamScore}
                    formErrors={formErrors}
                    handleInputChange={handleInputChange}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                )}
                <FormInput
                  label={formData.documentType === 'CV' ? 'Key Courses' : 'Relevant Coursework'}
                  name="keyCourses"
                  placeholder="e.g., Financial Analysis, Marketing Strategy"
                  tooltipText="List 3-5 courses most relevant to your target role."
                  value={formData.keyCourses}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Experience</h3>
              <p className="text-sm text-gray-600">
                {formData.documentType === 'Resume'
                  ? 'Highlight your relevant work experience.'
                  : 'Include internships, research, or volunteer work.'}
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <SectionToggle
                sectionName="workExperience"
                title={formData.documentType === 'Resume' ? 'Work Experience' : 'Experience & Internships'}
                icon={Briefcase}
                isOpen={true}
                onToggle={() => {}}
              />
              <div className="mt-4">
                {dynamicData.workExperience.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No experience added</h4>
                    <button
                      type="button"
                      onClick={() => initializeSection('workExperience')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
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
                    formErrors={formErrors}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                )}
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
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
                    formErrors={formErrors}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skills & Additional Information</h3>
              <p className="text-sm text-gray-600">
                Showcase your skills and additional qualifications to stand out.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <SectionToggle
                sectionName="skills"
                title={formData.documentType === 'Resume' ? 'Skills' : 'Technical Skills'}
                icon={Award}
                isOpen={true}
                onToggle={() => {}}
              />
              <div className="mt-4">
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
                  formErrors={formErrors}
                  showTooltip={showTooltip}
                  setShowTooltip={setShowTooltip}
                />
              </div>
            </div>

            {['certifications', 'languages', 'hobbies', 'references'].map((section) =>
              formData.documentType === 'CV' || section === 'certifications' ? (
                <div key={section} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <SectionToggle
                    sectionName={section}
                    title={{
                      certifications: 'Certifications & Training',
                      languages: 'Languages',
                      hobbies: 'Hobbies & Interests',
                      references: 'References',
                    }[section]}
                    icon={{ certifications: Award, languages: Languages, hobbies: Heart, references: User }[section]}
                    isOpen={sections[section]}
                    onToggle={() => toggleSection(section)}
                  />
                  {sections[section] && (
                    <div className="mt-4">
                      <DynamicSection
                        sectionName={section}
                        title={{
                          certifications: 'Certifications & Training',
                          languages: 'Languages',
                          hobbies: 'Hobbies & Interests',
                          references: 'References',
                        }[section]}
                        dynamicData={dynamicData}
                        addItem={addItem}
                        removeItem={removeItem}
                        updateItem={updateItem}
                        updateObjectItem={updateObjectItem}
                        updateAchievement={updateAchievement}
                        addAchievement={addAchievement}
                        removeAchievement={removeAchievement}
                        formErrors={formErrors}
                        showTooltip={showTooltip}
                        setShowTooltip={setShowTooltip}
                      />
                    </div>
                  )}
                </div>
              ) : null
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h3>
              <p className="text-sm text-gray-600">
                Double-check your information before generating your {formData.documentType.toLowerCase()}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Personal Info',
                  icon: User,
                  step: 0,
                  data: [
                    { label: 'Name', value: formData.fullName },
                    { label: 'Email', value: formData.email },
                    { label: 'Phone', value: formData.phone },
                    { label: 'Location', value: formData.location },
                    { label: 'Target Role', value: formData.targetJobTitle },
                  ],
                },
                {
                  title: 'Education',
                  icon: GraduationCap,
                  step: 1,
                  data: [
                    { label: 'Degree', value: formData.degree },
                    { label: 'Institution', value: formData.university },
                    {
                      label: 'Graduation',
                      value: formatDateToMonthYear(`${formData.graduationMonth}/${formData.graduationYear}`),
                    },
                    { label: 'GPA', value: formData.cgpa },
                  ],
                },
                {
                  title: 'Skills & Extras',
                  icon: Award,
                  step: 3,
                  data: [
                    { label: 'Skills', value: dynamicData.skills.length > 0 ? `${dynamicData.skills.length} skills` : '—' },
                    {
                      label: 'Experience',
                      value: dynamicData.workExperience.length > 0 ? `${dynamicData.workExperience.length} items` : '—',
                    },
                    { label: 'Projects', value: dynamicData.projects.length > 0 ? `${dynamicData.projects.length} items` : '—' },
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <section.icon className="w-5 h-5 mr-2 text-blue-600" />
                    {section.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {section.data.map((item) => (
                      <li key={item.label}>
                        <span className="text-gray-600 font-medium">{item.label}:</span> {item.value || '—'}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(section.step)}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{formData.documentType} Preview</h3>
              <div className="bg-gray-100 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Preview Your {formData.documentType}</h4>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    {previewMode ? 'Hide Preview' : 'Show Preview'}
                  </button>
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Your {formData.documentType}
            </h2>
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-sm text-gray-600 font-medium">Progress:</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">{formProgress}%</span>
            </div>
          </div>

          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    index === currentStep
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white bg-opacity-20 mr-2 text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {renderStepContent()}

            <div className="mt-8 flex justify-between items-center">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}

              <div className="flex items-center space-x-3 ml-auto">
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate {formData.documentType}
                        <FileText className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {submitSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">{formData.documentType} generated successfully!</p>
              </div>
            )}
            {formErrors.submit && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-700">{formErrors.submit}</p>
              </div>
            )}
          </form>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-1" />
            Save progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;