/**
 * OpenRouter Service
 * Handles interactions with the OpenRouter API to access multiple AI models
 */
const axios = require('axios');

class OpenRouterService {
  /**
   * Constructor
   * @param {string} apiKey - OpenRouter API key
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    
    this.apiKey = apiKey;
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://agentexpress.io', // Replace with your actual domain
        'X-Title': 'AgentExpress',
      },
    });
  }
  
  /**
   * Generate response using OpenRouter API
   * @param {string} prompt - User prompt
   * @param {Object} context - Context for generation
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Generated response
   */
  async generateResponse(prompt, context, options = {}) {
    try {
      const {
        systemPrompt = 'You are a helpful assistant.',
        temperature = 0.7,
        maxTokens = 1000,
        model = 'openai/gpt-4-turbo', // Default model
      } = context;
      
      // Prepare messages for chat completion
      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ];
      
      // Add conversation history if provided
      if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
        // Insert conversation history before the current user message
        messages.splice(1, 0, ...options.conversationHistory);
      }
      
      // Call OpenRouter API
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
        tools: options.tools || undefined,
        tool_choice: options.toolChoice || undefined,
      });
      
      // Extract and return the response text
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response with OpenRouter:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
  
  /**
   * Generate response with tool use
   * @param {string} prompt - User prompt
   * @param {Object} context - Context for generation
   * @param {Array<Object>} tools - Array of tool definitions
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Generated response with tool calls
   */
  async generateResponseWithTools(prompt, context, tools, options = {}) {
    try {
      const {
        systemPrompt = 'You are a helpful assistant.',
        temperature = 0.7,
        maxTokens = 1000,
        model = 'openai/gpt-4-turbo', // Default model for tool use
      } = context;
      
      // Prepare messages for chat completion
      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ];
      
      // Add conversation history if provided
      if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
        // Insert conversation history before the current user message
        messages.splice(1, 0, ...options.conversationHistory);
      }
      
      // Call OpenRouter API with tools
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
        tools,
        tool_choice: options.toolChoice || 'auto',
      });
      
      // Process response to extract tool calls
      const responseMessage = response.data.choices[0].message;
      const result = {
        text: responseMessage.content || '',
        toolCalls: [],
      };
      
      // Extract tool calls if present
      if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
        result.toolCalls = responseMessage.tool_calls.map(toolCall => ({
          id: toolCall.id,
          name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments),
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Error generating response with OpenRouter tools:', error);
      throw new Error(`Failed to generate response with tools: ${error.message}`);
    }
  }
  
  /**
   * Generate embeddings for text
   * @param {string} text - Text to generate embeddings for
   * @param {string} model - Embedding model to use
   * @returns {Promise<Array<number>>} Embeddings
   */
  async generateEmbeddings(text, model = 'openai/text-embedding-3-small') {
    try {
      const response = await this.client.post('/embeddings', {
        model,
        input: text,
      });
      
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embeddings with OpenRouter:', error);
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }
  
  /**
   * List available models from OpenRouter
   * @returns {Promise<Array<Object>>} List of available models
   */
  async listModels() {
    try {
      const response = await this.client.get('/models');
      return response.data.data;
    } catch (error) {
      console.error('Error listing models from OpenRouter:', error);
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }
  
  /**
   * Check if a specific model supports a feature
   * @param {string} model - Model identifier
   * @param {string} feature - Feature to check (e.g., 'tools', 'vision')
   * @returns {Promise<boolean>} Whether the model supports the feature
   */
  async modelSupportsFeature(model, feature) {
    try {
      const models = await this.listModels();
      const modelInfo = models.find(m => m.id === model);
      
      if (!modelInfo) {
        return false;
      }
      
      switch (feature) {
        case 'tools':
          return modelInfo.capabilities?.includes('tools') || false;
        case 'vision':
          return modelInfo.capabilities?.includes('vision') || false;
        case 'json':
          return modelInfo.capabilities?.includes('json') || false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking model feature support:', error);
      return false;
    }
  }
  
  /**
   * Generate response with vision capabilities
   * @param {string} prompt - User prompt
   * @param {Array<string>} imageUrls - Array of image URLs or base64 strings
   * @param {Object} context - Context for generation
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Generated response
   */
  async generateVisionResponse(prompt, imageUrls, context, options = {}) {
    try {
      const {
        systemPrompt = 'You are a helpful assistant.',
        temperature = 0.7,
        maxTokens = 1000,
        model = 'openai/gpt-4-vision', // Default vision model
      } = context;
      
      // Check if model supports vision
      const supportsVision = await this.modelSupportsFeature(model, 'vision');
      if (!supportsVision) {
        throw new Error(`Model ${model} does not support vision capabilities`);
      }
      
      // Prepare content for the user message
      const content = [];
      
      // Add text prompt
      content.push({
        type: 'text',
        text: prompt,
      });
      
      // Add images
      for (const imageUrl of imageUrls) {
        // Check if it's a base64 string or URL
        if (imageUrl.startsWith('data:image')) {
          content.push({
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          });
        } else {
          content.push({
            type: 'image_url',
            image_url: {
              url: imageUrl,
            },
          });
        }
      }
      
      // Prepare messages for chat completion
      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content,
        },
      ];
      
      // Call OpenRouter API
      const response = await this.client.post('/chat/completions', {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
      });
      
      // Extract and return the response text
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating vision response with OpenRouter:', error);
      throw new Error(`Failed to generate vision response: ${error.message}`);
    }
  }
}

module.exports = OpenRouterService;
