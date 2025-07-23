import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Eye, EyeOff, Settings, Check, X, AlertCircle, Zap } from 'lucide-react';
import { generateSummary, openRouterService } from '../utils/openRouterService';

const AISummaryGenerator = ({ 
  userData, 
  onSummaryGenerated, 
  currentSummary = '',
  className = '' 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState({ stage: '', message: '' });
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [lastGeneration, setLastGeneration] = useState(null);

  // Check if AI is available
  const isAIAvailable = openRouterService.isConfigured();

  // Initialize custom prompt
  useEffect(() => {
    if (!customPrompt && isAIAvailable) {
      setCustomPrompt(openRouterService.buildPrompt(userData));
    }
  }, [userData, customPrompt, isAIAvailable]);

  // Handle summary generation
  const handleGenerateSummary = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setError('');
    setGeneratedSummary('');
    setProgress({ stage: 'starting', message: 'Starting generation...' });

    try {
      const result = await generateSummary(userData, {
        useAI: useAI && isAIAvailable,
        onProgress: setProgress
      });

      setGeneratedSummary(result.summary);
      setLastGeneration(result);
      
      // Auto-apply if no current summary exists
      if (!currentSummary.trim()) {
        onSummaryGenerated(result.summary);
      }

    } catch (err) {
      setError(err.message || 'Failed to generate summary');
      setProgress({ stage: 'error', message: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply generated summary
  const handleApplySummary = () => {
    if (generatedSummary) {
      onSummaryGenerated(generatedSummary);
      setGeneratedSummary('');
    }
  };

  // Discard generated summary
  const handleDiscardSummary = () => {
    setGeneratedSummary('');
    setError('');
    setProgress({ stage: '', message: '' });
  };

  // Toggle prompt editor
  const togglePromptEditor = () => {
    setShowPromptEditor(!showPromptEditor);
    if (!showPromptEditor && !customPrompt) {
      setCustomPrompt(openRouterService.buildPrompt(userData));
    }
  };

  // Preview prompt
  const handlePreviewPrompt = () => {
    setShowPreview(!showPreview);
    if (!showPreview && !customPrompt) {
      setCustomPrompt(openRouterService.buildPrompt(userData));
    }
  };

  // Reset to default prompt
  const resetPrompt = () => {
    setCustomPrompt(openRouterService.buildPrompt(userData));
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Summary Generator</h3>
          {isAIAvailable && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              AI Enabled
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isAIAvailable && (
            <button
              onClick={togglePromptEditor}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit Prompt Template"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={handlePreviewPrompt}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Preview Prompt"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* AI Configuration Warning */}
      {!isAIAvailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">AI Generation Not Available</p>
              <p className="text-xs text-amber-700 mt-1">
                OpenRouter API key not configured. Using template-based generation only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generation Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {isAIAvailable && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useAI"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="useAI" className="text-sm text-gray-700">
              Use AI Generation
            </label>
          </div>
        )}
        
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          <span>
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </span>
        </button>
      </div>

      {/* Progress Indicator */}
      {isGenerating && progress.message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-800">{progress.message}</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <X className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">Generation Failed</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Generated Summary Preview */}
      {generatedSummary && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-green-800">Generated Summary</h4>
            {lastGeneration && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                {lastGeneration.source === 'ai' ? 'AI Generated' : 'Template Based'}
              </span>
            )}
          </div>
          
          <p className="text-sm text-green-900 mb-3 leading-relaxed">
            {generatedSummary}
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleApplySummary}
              className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
            >
              <Check className="w-3 h-3" />
              <span>Apply</span>
            </button>
            
            <button
              onClick={handleDiscardSummary}
              className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Discard</span>
            </button>
          </div>
        </div>
      )}

      {/* Prompt Preview */}
      {showPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Prompt Preview</h4>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {customPrompt || openRouterService.buildPrompt(userData)}
          </pre>
        </div>
      )}

      {/* Prompt Editor */}
      {showPromptEditor && isAIAvailable && (
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-800">Custom Prompt Template</h4>
            <button
              onClick={resetPrompt}
              className="text-xs text-purple-600 hover:text-purple-700 underline"
            >
              Reset to Default
            </button>
          </div>
          
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full h-32 text-xs border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            placeholder="Enter your custom prompt template..."
          />
          
          <p className="text-xs text-gray-500 mt-1">
            Customize the prompt sent to the AI model for summary generation.
          </p>
        </div>
      )}

      {/* Generation Info */}
      {lastGeneration && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <span>Source: {lastGeneration.source}</span>
            {lastGeneration.model && <span>Model: {lastGeneration.model}</span>}
            {lastGeneration.usage && (
              <span>Tokens: {lastGeneration.usage.total_tokens}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummaryGenerator;
