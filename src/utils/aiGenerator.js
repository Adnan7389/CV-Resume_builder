import { generateSummary } from './openRouterService';

export const generateContent = async (userData, options = {}) => {
  // Generate summary using new AI service with fallback
  let summary = '';
  
  if (userData.autoGenerateSummary !== false) {
    try {
      const result = await generateSummary(userData, options);
      summary = result.summary;
    } catch (error) {
      console.warn('Summary generation failed:', error);
      // Fallback to original template-based generation
      summary = userData.documentType === 'Resume' 
        ? generateTailoredResumeSummary(userData)
        : generateCVSummary(userData);
    }
  } else {
    summary = userData.professionalSummary || '';
  }

  // For resumes, tailor content based on job description
  if (userData.documentType === 'Resume') {
    return generateTailoredResumeContent(userData, summary);
  }

  return {
    summary,
    skills: categorizeSkills(userData.skills || []),
    workExperience: enhanceWorkExperience(userData.workExperience || []),
    projects: userData.projects || [],
    certifications: userData.certifications || [],
    languages: userData.languages || [],
    hobbies: userData.hobbies || [],
    references: userData.references || []
  };
};

// Legacy function for backward compatibility
export const generateContentSync = (userData) => {
  const summary = userData.autoGenerateSummary !== false 
    ? (userData.documentType === 'Resume' 
        ? generateTailoredResumeSummary(userData)
        : generateCVSummary(userData))
    : userData.professionalSummary || '';

  // For resumes, tailor content based on job description
  if (userData.documentType === 'Resume') {
    return generateTailoredResumeContent(userData, summary);
  }

  return {
    summary,
    skills: categorizeSkills(userData.skills || []),
    workExperience: enhanceWorkExperience(userData.workExperience || []),
    projects: userData.projects || [],
    certifications: userData.certifications || [],
    languages: userData.languages || [],
    hobbies: userData.hobbies || [],
    references: userData.references || []
  };
};

const generateTailoredResumeContent = (userData, summary) => {
  const jobKeywords = extractJobKeywords(userData.jobDescription || '');
  const jobRequirements = extractJobRequirements(userData.jobDescription || '');
  
  // Prioritize and categorize skills based on job relevance
  const tailoredSkills = prioritizeSkillsForJob(userData.skills || [], jobKeywords);
  const categorizedSkills = categorizeSkills(tailoredSkills);
  
  // Enhance work experience with action-based descriptions
  const enhancedExperience = enhanceWorkExperience(userData.workExperience || []);
  const tailoredExperience = tailorWorkExperience(enhancedExperience, jobKeywords, jobRequirements);
  
  // Select most relevant projects
  const relevantProjects = selectRelevantProjects(userData.projects || [], jobKeywords, userData.targetJobTitle);
  
  // Filter certifications for relevance
  const relevantCertifications = filterRelevantCertifications(userData.certifications || [], jobKeywords);

  return {
    summary,
    skills: categorizedSkills,
    workExperience: tailoredExperience,
    projects: relevantProjects,
    certifications: relevantCertifications,
    languages: userData.languages || [],
    hobbies: [], // Remove hobbies for resume format
    references: [] // Remove references for resume format
  };
};

// Categorize skills into technical and soft skills
const categorizeSkills = (skills) => {
  if (!skills || skills.length === 0) return { technical: [], soft: [] };
  
  const technicalKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css', 'php', 'c++', 'c#',
    'excel', 'powerpoint', 'word', 'office', 'photoshop', 'illustrator', 'autocad', 'solidworks',
    'salesforce', 'sap', 'quickbooks', 'tableau', 'power bi', 'google analytics', 'adobe',
    'microsoft', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'github', 'linux', 'windows',
    'database', 'mysql', 'postgresql', 'mongodb', 'api', 'rest', 'json', 'xml', 'agile', 'scrum',
    'project management', 'data analysis', 'machine learning', 'ai', 'blockchain', 'cybersecurity'
  ];
  
  const softKeywords = [
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'organization', 'adaptability', 'creativity', 'collaboration',
    'customer service', 'presentation', 'negotiation', 'conflict resolution', 'mentoring',
    'training', 'public speaking', 'writing', 'research', 'analytical thinking'
  ];
  
  const technical = [];
  const soft = [];
  
  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const isTechnical = technicalKeywords.some(keyword => 
      skillLower.includes(keyword) || keyword.includes(skillLower)
    );
    const isSoft = softKeywords.some(keyword => 
      skillLower.includes(keyword) || keyword.includes(skillLower)
    );
    
    if (isTechnical) {
      technical.push(skill);
    } else if (isSoft) {
      soft.push(skill);
    } else {
      // Default to technical if unclear
      technical.push(skill);
    }
  });
  
  return { technical, soft };
};

// Enhance work experience with action-based bullet points
const enhanceWorkExperience = (workExperience) => {
  const actionVerbs = [
    'Led', 'Developed', 'Improved', 'Created', 'Managed', 'Designed', 'Implemented',
    'Coordinated', 'Supervised', 'Analyzed', 'Optimized', 'Streamlined', 'Established',
    'Executed', 'Delivered', 'Achieved', 'Increased', 'Reduced', 'Enhanced', 'Built',
    'Launched', 'Maintained', 'Collaborated', 'Facilitated', 'Trained', 'Mentored',
    'Negotiated', 'Resolved', 'Automated', 'Standardized', 'Monitored', 'Evaluated'
  ];
  
  return workExperience.map(exp => ({
    ...exp,
    achievements: exp.achievements.map(achievement => {
      if (!achievement || achievement.trim() === '') return achievement;
      
      // Check if already starts with action verb
      const firstWord = achievement.trim().split(' ')[0];
      const hasActionVerb = actionVerbs.some(verb => 
        firstWord.toLowerCase() === verb.toLowerCase()
      );
      
      if (hasActionVerb) return achievement;
      
      // Add appropriate action verb based on content
      const lowerAchievement = achievement.toLowerCase();
      let actionVerb = 'Contributed to';
      
      if (lowerAchievement.includes('increase') || lowerAchievement.includes('improve') || lowerAchievement.includes('boost')) {
        actionVerb = 'Increased';
      } else if (lowerAchievement.includes('develop') || lowerAchievement.includes('create') || lowerAchievement.includes('build')) {
        actionVerb = 'Developed';
      } else if (lowerAchievement.includes('manage') || lowerAchievement.includes('oversee') || lowerAchievement.includes('supervise')) {
        actionVerb = 'Managed';
      } else if (lowerAchievement.includes('lead') || lowerAchievement.includes('direct') || lowerAchievement.includes('head')) {
        actionVerb = 'Led';
      } else if (lowerAchievement.includes('design') || lowerAchievement.includes('plan') || lowerAchievement.includes('architect')) {
        actionVerb = 'Designed';
      } else if (lowerAchievement.includes('implement') || lowerAchievement.includes('execute') || lowerAchievement.includes('deploy')) {
        actionVerb = 'Implemented';
      } else if (lowerAchievement.includes('analyze') || lowerAchievement.includes('research') || lowerAchievement.includes('evaluate')) {
        actionVerb = 'Analyzed';
      } else if (lowerAchievement.includes('coordinate') || lowerAchievement.includes('organize') || lowerAchievement.includes('arrange')) {
        actionVerb = 'Coordinated';
      } else if (lowerAchievement.includes('train') || lowerAchievement.includes('teach') || lowerAchievement.includes('educate')) {
        actionVerb = 'Trained';
      } else if (lowerAchievement.includes('collaborate') || lowerAchievement.includes('work with') || lowerAchievement.includes('partner')) {
        actionVerb = 'Collaborated';
      }
      
      return `${actionVerb} ${achievement.charAt(0).toLowerCase() + achievement.slice(1)}`;
    })
  }));
};

const prioritizeSkillsForJob = (userSkills, jobKeywords) => {
  if (!userSkills || userSkills.length === 0) return [];
  
  const skillsWithRelevance = userSkills.map(skill => {
    const relevanceScore = calculateSkillRelevance(skill, jobKeywords);
    return { skill, relevanceScore };
  });
  
  // Sort by relevance and return top skills
  return skillsWithRelevance
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 8) // Limit to top 8 most relevant skills
    .map(item => item.skill);
};

const calculateSkillRelevance = (skill, jobKeywords) => {
  const skillLower = skill.toLowerCase();
  let score = 0;
  
  jobKeywords.forEach(keyword => {
    if (skillLower.includes(keyword) || keyword.includes(skillLower)) {
      score += 2; // Exact match
    } else if (skillLower.split(' ').some(word => keyword.includes(word) || word.includes(keyword))) {
      score += 1; // Partial match
    }
  });
  
  return score;
};

const tailorWorkExperience = (workExperience, jobKeywords, jobRequirements) => {
  return workExperience.map(exp => {
    // Prioritize achievements that match job requirements
    const relevantAchievements = exp.achievements
      .map(achievement => ({
        text: achievement,
        relevance: calculateAchievementRelevance(achievement, jobKeywords, jobRequirements)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4) // Limit to top 4 most relevant achievements
      .map(item => item.text);
    
    return {
      ...exp,
      achievements: relevantAchievements
    };
  });
};

const calculateAchievementRelevance = (achievement, jobKeywords, jobRequirements) => {
  const achievementLower = achievement.toLowerCase();
  let score = 0;
  
  // Check against job keywords
  jobKeywords.forEach(keyword => {
    if (achievementLower.includes(keyword)) score += 2;
  });
  
  // Check against job requirements
  jobRequirements.forEach(requirement => {
    if (achievementLower.includes(requirement.toLowerCase())) score += 3;
  });
  
  // Bonus for quantifiable results
  if (/\d+%|\d+\$|\d+ (million|thousand|hours|days|projects|clients)/.test(achievementLower)) {
    score += 2;
  }
  
  return score;
};

const selectRelevantProjects = (projects, jobKeywords, targetJobTitle) => {
  if (!projects || projects.length === 0) return [];
  
  const projectsWithRelevance = projects.map(project => {
    const relevanceScore = calculateProjectRelevance(project, jobKeywords, targetJobTitle);
    return { project, relevanceScore };
  });
  
  // Return top 3 most relevant projects
  return projectsWithRelevance
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)
    .map(item => item.project);
};

const calculateProjectRelevance = (project, jobKeywords, targetJobTitle) => {
  const projectText = `${project.title} ${project.description} ${project.technologies}`.toLowerCase();
  const targetLower = (targetJobTitle || '').toLowerCase();
  let score = 0;
  
  // Check against job keywords
  jobKeywords.forEach(keyword => {
    if (projectText.includes(keyword)) score += 2;
  });
  
  // Check against target job title
  if (targetLower && projectText.includes(targetLower)) {
    score += 3;
  }
  
  return score;
};

const filterRelevantCertifications = (certifications, jobKeywords) => {
  if (!certifications || certifications.length === 0) return [];
  
  return certifications.filter(cert => {
    const certLower = cert.toLowerCase();
    return jobKeywords.some(keyword => 
      certLower.includes(keyword) || keyword.includes(certLower)
    );
  });
};

const extractJobRequirements = (jobDescription) => {
  if (!jobDescription) return [];
  
  const requirementPatterns = [
    /(?:required|must have|essential|necessary)[\s\S]*?(?:\n|$)/gi,
    /(?:responsibilities|duties)[\s\S]*?(?:\n|$)/gi,
    /(?:experience with|proficiency in|knowledge of)[\s\S]*?(?:\n|$)/gi
  ];
  
  const requirements = [];
  requirementPatterns.forEach(pattern => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      requirements.push(...matches.map(match => match.trim()));
    }
  });
  
  return requirements.slice(0, 5); // Limit to top 5 requirements
};

const determineIndustryContext = (jobDescription, targetJobTitle) => {
  const jobText = `${jobDescription} ${targetJobTitle}`.toLowerCase();
  
  // Define industry contexts
  const contexts = {
    technology: {
      keywords: ['software', 'developer', 'engineer', 'tech', 'programming', 'coding', 'digital'],
      focus: 'software development and technology solutions',
      outcomes: 'innovation and technical excellence'
    },
    healthcare: {
      keywords: ['medical', 'health', 'patient', 'clinical', 'nurse', 'doctor', 'therapy'],
      focus: 'patient care and healthcare delivery',
      outcomes: 'improved patient outcomes'
    },
    education: {
      keywords: ['teacher', 'education', 'school', 'student', 'curriculum', 'learning'],
      focus: 'educational excellence and student development',
      outcomes: 'enhanced learning outcomes'
    },
    business: {
      keywords: ['business', 'management', 'sales', 'marketing', 'finance', 'operations'],
      focus: 'business operations and strategic initiatives',
      outcomes: 'business growth and operational efficiency'
    },
    default: {
      keywords: [],
      focus: 'operational excellence and team collaboration',
      outcomes: 'organizational success'
    }
  };
  
  // Find matching industry context
  for (const [industry, context] of Object.entries(contexts)) {
    if (industry !== 'default' && context.keywords.some(keyword => jobText.includes(keyword))) {
      return context;
    }
  }
  
  return contexts.default;
};

const determineExperienceLevel = (workExperience) => {
  const totalExperience = workExperience.length;
  
  if (totalExperience === 0) return 'Motivated';
  if (totalExperience === 1) return 'Emerging';
  if (totalExperience <= 3) return 'Experienced';
  return 'Senior';
};

const generateCVSummary = (userData) => {
  const { fullName, department, cgpa, targetJobTitle } = userData;
  
  const summaryTemplates = [
    `Motivated ${department || 'graduate'} with ${cgpa ? `a ${cgpa} CGPA` : 'strong academic performance'} seeking to leverage academic excellence and practical skills in a ${targetJobTitle || 'professional'} role. Demonstrated ability to apply theoretical knowledge to real-world challenges and contribute to organizational success.`,
    `Dedicated ${department || 'student'} with ${cgpa ? `strong academic performance (CGPA: ${cgpa})` : 'excellent academic record'} and passion for ${targetJobTitle || 'professional development'} opportunities. Committed to continuous learning and professional growth while contributing innovative solutions to complex problems.`,
    `Results-driven ${department || 'graduate'} with ${cgpa ? `${cgpa} CGPA` : 'outstanding academic achievement'}, equipped with comprehensive knowledge and practical skills relevant to ${targetJobTitle || 'professional'} positions. Eager to contribute to organizational objectives while developing professional expertise.`
  ];

  return summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)];
};

const generateResumeSummary = (userData) => {
  const { department, cgpa, targetJobTitle, jobDescription } = userData;
  
  // Extract key requirements from job description
  const jobKeywords = extractJobKeywords(jobDescription || '');
  const relevantSkills = matchSkillsToJob(userData.skills, jobKeywords);
  
  // Create industry-agnostic summary templates
  const resumeTemplates = [
    `${department ? `${department} professional` : 'Dedicated professional'} ${cgpa ? `with ${cgpa} GPA` : ''} and proven expertise in ${relevantSkills.slice(0, 3).join(', ') || 'key competencies'}. Seeking to contribute to ${targetJobTitle || 'organizational success'} by applying strong analytical skills and practical knowledge to drive business objectives and deliver measurable results.`,
    
    `Results-oriented ${department ? `${department} graduate` : 'professional'} ${cgpa ? `with ${cgpa} GPA` : ''} and hands-on experience in ${relevantSkills.slice(0, 2).join(' and ') || 'core competencies'}. Ready to leverage academic foundation and practical skills to excel as ${targetJobTitle || 'a team member'} and contribute to organizational growth.`,
    
    `Motivated ${department ? `${department} specialist` : 'professional'} ${cgpa ? `(GPA: ${cgpa})` : ''} with demonstrated proficiency in ${relevantSkills.slice(0, 3).join(', ') || 'essential skills'}. Eager to apply problem-solving abilities and practical expertise in a ${targetJobTitle || 'challenging role'} to deliver innovative solutions and exceed performance expectations.`
  ];

  return resumeTemplates[Math.floor(Math.random() * resumeTemplates.length)];
};

const extractJobKeywords = (jobDescription) => {
  if (!jobDescription) return [];
  
  // Enhanced keyword extraction with modern job requirements
  const modernKeywords = [
    // Core Technical Skills
    'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'express',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'html5', 'css3', 'sass', 'bootstrap',
    'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'devops',
    
    // Data & Analytics
    'data analysis', 'data science', 'machine learning', 'ai', 'tableau', 'power bi', 'excel',
    'r', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'statistics', 'visualization',
    
    // Business & Management
    'project management', 'agile', 'scrum', 'kanban', 'pmp', 'six sigma', 'lean',
    'stakeholder management', 'budget management', 'risk management', 'change management',
    'strategic planning', 'business analysis', 'process improvement', 'kpi', 'roi',
    
    // Marketing & Sales
    'digital marketing', 'seo', 'sem', 'social media', 'content marketing', 'email marketing',
    'google analytics', 'facebook ads', 'linkedin', 'crm', 'salesforce', 'hubspot',
    'lead generation', 'conversion optimization', 'a/b testing', 'market research',
    
    // Design & Creative
    'ui/ux', 'user experience', 'user interface', 'figma', 'sketch', 'adobe creative suite',
    'photoshop', 'illustrator', 'indesign', 'wireframing', 'prototyping', 'design thinking',
    
    // Communication & Soft Skills
    'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'organization', 'adaptability', 'creativity', 'collaboration',
    'presentation', 'public speaking', 'writing', 'editing', 'research', 'analytical thinking',
    
    // Industry-Specific
    'healthcare', 'finance', 'education', 'retail', 'manufacturing', 'logistics',
    'customer service', 'quality assurance', 'compliance', 'regulatory', 'audit',
    'accounting', 'bookkeeping', 'financial analysis', 'budgeting', 'forecasting',
    
    // Modern Work Skills
    'remote work', 'virtual collaboration', 'cross-functional', 'multicultural',
    'innovation', 'digital transformation', 'automation', 'process optimization',
    'customer experience', 'user-centered', 'data-driven', 'results-oriented'
  ];
  
  const lowerJobDesc = jobDescription.toLowerCase();
  const foundKeywords = modernKeywords.filter(keyword => 
    lowerJobDesc.includes(keyword.toLowerCase())
  );
  
  // Also extract custom keywords from job description
  const customKeywords = extractCustomKeywords(jobDescription);
  
  return [...new Set([...foundKeywords, ...customKeywords])];
};

// Extract custom keywords from job description using NLP-like approach
const extractCustomKeywords = (jobDescription) => {
  if (!jobDescription) return [];
  
  // Remove common words and extract meaningful terms
  const commonWords = [
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
    'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'must', 'shall', 'this', 'that', 'these', 'those', 'a', 'an', 'as', 'if', 'then', 'than', 'when',
    'where', 'why', 'how', 'what', 'who', 'which', 'whose', 'whom', 'we', 'you', 'they', 'them', 'their',
    'our', 'your', 'his', 'her', 'its', 'my', 'me', 'i', 'he', 'she', 'it', 'us', 'him', 'her'
  ];
  
  const words = jobDescription
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
  
  // Count word frequency and return most common meaningful terms
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .filter(([word, count]) => count >= 2) // Appears at least twice
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

// Generate professional file name
export const generateFileName = (userData) => {
  const firstName = userData.fullName?.split(' ')[0] || 'Resume';
  const lastName = userData.fullName?.split(' ').slice(1).join('_') || '';
  const documentType = userData.documentType || 'Resume';
  
  if (lastName) {
    return `${firstName}_${lastName}_${documentType}.pdf`;
  }
  return `${firstName}_${documentType}.pdf`;
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString || dateString === 'Present' || dateString === 'Current') return 'Present';
  
  // Handle month input format (YYYY-MM)
  if (dateString.includes('-') && dateString.length === 7) {
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  
  // Handle legacy date format
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Format graduation date from month and year
export const formatGraduationDate = (month, year) => {
  if (!month || !year) return '';
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = parseInt(month) - 1;
  if (monthIndex >= 0 && monthIndex < 12) {
    return `${monthNames[monthIndex]} ${year}`;
  }
  
  return `${year}`;
};