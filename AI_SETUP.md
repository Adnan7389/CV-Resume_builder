# AI-Powered Resume Builder Setup Guide

## OpenRouter API Integration

This guide will help you set up AI-powered professional summary generation using OpenRouter API.

## 🚀 Quick Setup

### Step 1: Get Your OpenRouter API Key

1. **Visit OpenRouter**: Go to [https://openrouter.ai](https://openrouter.ai)
2. **Sign Up/Login**: Create an account or log in
3. **Get API Key**: 
   - Go to your dashboard
   - Navigate to "API Keys" section
   - Click "Create New Key"
   - Copy your API key (starts with `sk-or-v1-...`)

### Step 2: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Add your API key to `.env`**:
   ```bash
   # OpenRouter AI Configuration
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   VITE_AI_MODEL=anthropic/claude-3-haiku
   VITE_AI_TIMEOUT=30000
   VITE_AI_FALLBACK_ENABLED=true
   ```

### Step 3: Restart Development Server

```bash
npm run dev
```

## 🤖 Available AI Models

You can choose from various models by updating `VITE_AI_MODEL`:

### Recommended Models (Cost-Effective):
- `anthropic/claude-3-haiku` - Fast, affordable, great for summaries
- `openai/gpt-3.5-turbo` - Reliable, good balance of cost/quality
- `meta-llama/llama-3-8b-instruct` - Open source, very affordable

### Premium Models (Higher Quality):
- `anthropic/claude-3-sonnet` - Better quality, higher cost
- `openai/gpt-4-turbo` - Excellent quality, premium pricing
- `anthropic/claude-3-opus` - Top quality, highest cost

### Budget Models (Ultra Low Cost):
- `mistralai/mistral-7b-instruct` - Very cheap, decent quality
- `openchat/openchat-7b` - Free tier available

## 💰 Cost Estimation

Typical costs per summary generation:

| Model | Cost per Summary | Quality |
|-------|------------------|---------|
| Claude 3 Haiku | ~$0.001-0.003 | ⭐⭐⭐⭐ |
| GPT-3.5 Turbo | ~$0.002-0.005 | ⭐⭐⭐⭐ |
| Llama 3 8B | ~$0.0005-0.001 | ⭐⭐⭐ |
| Mistral 7B | ~$0.0001-0.0005 | ⭐⭐⭐ |

## 🔧 Configuration Options

### Environment Variables Explained:

```bash
# Your OpenRouter API key
VITE_OPENROUTER_API_KEY=sk-or-v1-...

# API endpoint (don't change unless using different service)
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions

# AI model to use for generation
VITE_AI_MODEL=anthropic/claude-3-haiku

# Request timeout in milliseconds
VITE_AI_TIMEOUT=30000

# Enable fallback to template-based summaries if AI fails
VITE_AI_FALLBACK_ENABLED=true

# Enable AI summary feature
VITE_ENABLE_AI_SUMMARIES=true
```

## 🛠️ Features

### AI Summary Generator Component

The app includes a comprehensive AI Summary Generator with:

- **Smart Generation**: Uses job description and user data to create tailored summaries
- **Fallback System**: Automatically falls back to template-based summaries if AI fails
- **Custom Prompts**: Edit the prompt template for personalized results
- **Preview Mode**: See the exact prompt sent to the AI
- **Progress Tracking**: Real-time generation progress with loading states
- **Error Handling**: Graceful error messages and retry options
- **Cost Tracking**: Monitor token usage and model information

### How It Works

1. **Data Collection**: Gathers user information (name, skills, experience, job description)
2. **Prompt Building**: Creates a tailored prompt based on the target role
3. **AI Generation**: Sends request to OpenRouter API with selected model
4. **Fallback**: If AI fails, uses template-based generation
5. **User Control**: User can accept, edit, or regenerate the summary

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use different API keys for development/production
- ✅ Rotate API keys regularly
- ✅ Monitor API usage and set billing alerts

### API Key Management
```bash
# Development
VITE_OPENROUTER_API_KEY=sk-or-v1-dev-key-here

# Production (set in deployment platform)
VITE_OPENROUTER_API_KEY=sk-or-v1-prod-key-here
```

## 🚀 Deployment Configuration

### Netlify
1. Go to Site Settings → Environment Variables
2. Add: `VITE_OPENROUTER_API_KEY` with your production key
3. Add other AI-related variables as needed

### Vercel
1. Go to Project Settings → Environment Variables
2. Add production environment variables
3. Redeploy your application

### GitHub Pages
Update your GitHub Actions workflow:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
    VITE_AI_MODEL: anthropic/claude-3-haiku
```

## 🐛 Troubleshooting

### Common Issues:

**1. "API key not configured" error**
- Check if `.env` file exists and contains `VITE_OPENROUTER_API_KEY`
- Restart development server after adding environment variables
- Ensure API key starts with `sk-or-v1-`

**2. "Request timeout" error**
- Increase `VITE_AI_TIMEOUT` value
- Check your internet connection
- Try a different model (some are faster)

**3. "API Error: 401" - Unauthorized**
- Verify your API key is correct
- Check if you have credits in your OpenRouter account
- Ensure API key has proper permissions

**4. "API Error: 429" - Rate Limited**
- Wait a moment and try again
- Consider upgrading your OpenRouter plan
- Implement request queuing in your app

**5. Fallback not working**
- Ensure `VITE_AI_FALLBACK_ENABLED=true`
- Check template functions in `openRouterService.js`

### Debug Mode
Enable debug mode to see detailed logs:
```bash
VITE_ENABLE_DEBUG_MODE=true
```

## 📊 Monitoring Usage

### Track API Costs
- Monitor usage in OpenRouter dashboard
- Set up billing alerts
- Use budget-friendly models for development

### Performance Optimization
- Cache generated summaries locally
- Implement request debouncing
- Use faster models for real-time features

## 🔄 Fallback System

The app includes a robust fallback system:

1. **Primary**: AI-generated summaries using OpenRouter
2. **Fallback**: Template-based summaries with smart placeholders
3. **Manual**: User can always write their own summary

This ensures the app works even without API keys or when AI services are unavailable.

## 📝 Customization

### Custom Prompt Templates
Edit the prompt in `src/utils/openRouterService.js`:

```javascript
buildPrompt(userData) {
  let prompt = `Create a professional summary for:\n\n`;
  // Customize your prompt here
  return prompt;
}
```

### Model Parameters
Adjust AI behavior in the API call:
```javascript
{
  model: this.model,
  max_tokens: 200,      // Length of response
  temperature: 0.7,     // Creativity (0-1)
  top_p: 0.9,          // Diversity
  frequency_penalty: 0.1, // Avoid repetition
  presence_penalty: 0.1   // Encourage new topics
}
```

## 🎯 Best Practices

1. **Start with budget models** during development
2. **Use premium models** for production
3. **Set reasonable timeouts** (30-60 seconds)
4. **Always enable fallbacks** for reliability
5. **Monitor costs** regularly
6. **Test with various user data** scenarios
7. **Implement proper error handling**

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review OpenRouter documentation
3. Check the browser console for errors
4. Verify environment variables are loaded correctly

---

**Ready to generate AI-powered professional summaries!** 🚀
