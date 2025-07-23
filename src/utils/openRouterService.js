// OpenRouter API service for AI-generated summaries
class OpenRouterService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.apiUrl = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.model = import.meta.env.VITE_AI_MODEL || 'mistralai/mistral-7b-instruct';
    this.timeout = parseInt(import.meta.env.VITE_AI_TIMEOUT) || 30000;
    this.fallbackEnabled = import.meta.env.VITE_AI_FALLBACK_ENABLED !== 'false';
  }

  // Check if API is configured
  isConfigured() {
    const hasKey = Boolean(this.apiKey && this.apiKey !== 'your_openrouter_api_key_here');
    
    // Debug logging (remove in production)
    if (import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true') {
      console.log('OpenRouter API Configuration:', {
        hasApiKey: hasKey,
        apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'none',
        model: this.model,
        timeout: this.timeout
      });
    }
    
    return hasKey;
  }

  // Generate AI summary using OpenRouter
  async generateAISummary(prompt, userData) {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter API key not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart CV Resume Builder'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer and career coach. Create compelling, ATS-friendly professional summaries that highlight key achievements and skills relevant to the target role. Keep summaries concise (2-3 sentences), action-oriented, and tailored to the job description when provided.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }

      return {
        success: true,
        summary: data.choices[0].message.content.trim(),
        usage: data.usage,
        model: data.model
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      throw error;
    }
  }

  // Build prompt for AI summary generation
  buildPrompt(userData) {
    const {
      fullName,
      targetJobTitle,
      department,
      cgpa,
      skills = [],
      workExperience = [],
      jobDescription,
      documentType
    } = userData;

    // Extract key experience highlights
    const experienceHighlights = workExperience
      .slice(0, 2) // Top 2 experiences
      .map(exp => `${exp.jobTitle} at ${exp.company}`)
      .join(', ');

    // Top skills
    const topSkills = skills.slice(0, 6).join(', ');

    let prompt = `Create a professional ${documentType.toLowerCase()} summary for:\n\n`;
    prompt += `Name: ${fullName}\n`;
    prompt += `Target Role: ${targetJobTitle}\n`;
    
    if (department) prompt += `Field of Study: ${department}\n`;
    if (cgpa) prompt += `GPA: ${cgpa}\n`;
    if (topSkills) prompt += `Key Skills: ${topSkills}\n`;
    if (experienceHighlights) prompt += `Experience: ${experienceHighlights}\n`;
    
    if (jobDescription) {
      prompt += `\nJob Description to tailor for:\n${jobDescription.substring(0, 500)}...\n`;
    }

    prompt += `\nRequirements:
- Write a compelling ${documentType.toLowerCase()} summary (2-3 sentences)
- Make it ATS-friendly and keyword-rich
- Highlight quantifiable achievements when possible
- Match the tone to the target role
- Focus on value proposition and unique strengths
${jobDescription ? '- Tailor content to match the job requirements' : ''}

Return only the professional summary text, no additional formatting or explanations.`;

    return prompt;
  }
}

// Create singleton instance
export const openRouterService = new OpenRouterService();

// Main function to generate summary with fallback
export async function generateSummary(userData, options = {}) {
  const {
    useAI = import.meta.env.VITE_ENABLE_AI_SUMMARIES !== 'false',
    onProgress = () => {},
    signal
  } = options;

  // Progress callback
  onProgress({ stage: 'starting', message: 'Initializing summary generation...' });

  try {
    // Try AI generation first if enabled and configured
    if (useAI && openRouterService.isConfigured()) {
      onProgress({ stage: 'ai_generation', message: 'Generating AI-powered summary...' });
      
      const prompt = openRouterService.buildPrompt(userData);
      const result = await openRouterService.generateAISummary(prompt, userData);
      
      onProgress({ 
        stage: 'completed', 
        message: 'AI summary generated successfully!',
        aiGenerated: true 
      });
      
      return {
        summary: result.summary,
        source: 'ai',
        model: result.model,
        usage: result.usage
      };
    }
  } catch (error) {
    console.warn('AI summary generation failed:', error.message);
    
    // If fallback is disabled, throw the error
    if (!openRouterService.fallbackEnabled) {
      onProgress({ 
        stage: 'error', 
        message: `AI generation failed: ${error.message}`,
        error 
      });
      throw error;
    }
    
    onProgress({ 
      stage: 'fallback', 
      message: 'AI generation failed, using template-based summary...' 
    });
  }

  // Fallback to template-based generation
  onProgress({ stage: 'template_generation', message: 'Generating template-based summary...' });
  
  const templateSummary = generateTemplateSummary(userData);
  
  onProgress({ 
    stage: 'completed', 
    message: 'Template summary generated successfully!',
    aiGenerated: false 
  });
  
  return {
    summary: templateSummary,
    source: 'template'
  };
}

// Template-based summary generation (fallback)
function generateTemplateSummary(userData) {
  const { documentType } = userData;
  
  if (documentType === 'Resume') {
    return generateTemplateResumeSummary(userData);
  } else {
    return generateTemplateCVSummary(userData);
  }
}

function generateTemplateResumeSummary(userData) {
  const { 
    department, 
    cgpa, 
    targetJobTitle, 
    skills = [], 
    workExperience = [],
    jobDescription 
  } = userData;
  
  // Extract relevant skills and experience
  const topSkills = skills.slice(0, 4).join(', ');
  const experienceYears = calculateExperienceYears(workExperience);
  const hasExperience = workExperience.length > 0;
  
  const templates = [
    `${hasExperience ? `Experienced` : `Motivated`} ${department || 'professional'} ${cgpa ? `with ${cgpa} GPA` : ''} specializing in ${topSkills || 'key competencies'}. ${hasExperience ? `${experienceYears} years of proven track record` : 'Strong academic foundation'} with expertise in ${targetJobTitle || 'target field'}. Seeking to leverage technical skills and ${hasExperience ? 'professional experience' : 'academic knowledge'} to drive organizational success.`,
    
    `Results-driven ${department || 'professional'} ${cgpa ? `(GPA: ${cgpa})` : ''} with demonstrated expertise in ${topSkills || 'core competencies'}. ${hasExperience ? `Proven ability to deliver results in ${workExperience[0]?.company || 'professional environments'}` : 'Strong problem-solving abilities and analytical thinking'}. Ready to contribute innovative solutions and exceed performance expectations in ${targetJobTitle || 'target role'}.`,
    
    `${hasExperience ? 'Accomplished' : 'Dedicated'} ${department || 'professional'} ${cgpa ? `with strong academic performance (${cgpa} GPA)` : ''} and expertise in ${topSkills || 'essential skills'}. ${hasExperience ? `Track record of success in ${experienceYears > 1 ? 'multiple' : ''} professional roles` : 'Committed to continuous learning and professional growth'}. Eager to apply technical proficiency and ${hasExperience ? 'leadership skills' : 'fresh perspective'} to achieve organizational objectives.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateTemplateCVSummary(userData) {
  const { fullName, department, cgpa, targetJobTitle } = userData;
  
  const templates = [
    `Motivated ${department || 'graduate'} with ${cgpa ? `a ${cgpa} CGPA` : 'strong academic performance'} seeking to leverage academic excellence and practical skills in a ${targetJobTitle || 'professional'} role. Demonstrated ability to apply theoretical knowledge to real-world challenges and contribute to organizational success.`,
    
    `Dedicated ${department || 'student'} with ${cgpa ? `strong academic performance (CGPA: ${cgpa})` : 'excellent academic record'} and passion for ${targetJobTitle || 'professional development'} opportunities. Committed to continuous learning and professional growth while contributing innovative solutions to complex problems.`,
    
    `Results-driven ${department || 'graduate'} with ${cgpa ? `${cgpa} CGPA` : 'outstanding academic achievement'}, equipped with comprehensive knowledge and practical skills relevant to ${targetJobTitle || 'professional'} positions. Eager to contribute to organizational objectives while developing professional expertise.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// Helper function to calculate years of experience
function calculateExperienceYears(workExperience) {
  if (!workExperience || workExperience.length === 0) return 0;
  
  let totalMonths = 0;
  
  workExperience.forEach(exp => {
    if (exp.startDate) {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate && exp.endDate !== 'Present' 
        ? new Date(exp.endDate) 
        : new Date();
      
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      totalMonths += Math.max(0, months);
    }
  });
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
}
