/**
 * Claude Service
 * Handles interactions with the Anthropic Claude API
 */
const { Anthropic } = require('@anthropic-ai/sdk');

class ClaudeService {
  /**
   * Constructor
   * @param {string} apiKey - Anthropic API key
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }
    
    this.client = new Anthropic({
      apiKey,
    });
  }
  
  /**
   * Generate response using Claude API
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
        model = 'claude-3-opus-20240229',
      } = context;
      
      // Prepare messages for chat completion
      const messages = [
        {
          role: 'user',
          content: prompt,
        },
      ];
      
      // Add conversation history if provided
      if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
        // Insert conversation history before the current user message
        messages.unshift(...options.conversationHistory);
      }
      
      // Call Claude API
      const response = await this.client.messages.create({
        model,
        system: systemPrompt,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
        top_k: options.topK || 40,
      });
      
      // Extract and return the response text
      return response.content[0].text;
    } catch (error) {
      console.error('Error generating response with Claude:', error);
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
        model = 'claude-3-opus-20240229',
      } = context;
      
      // Prepare messages for chat completion
      const messages = [
        {
          role: 'user',
          content: prompt,
        },
      ];
      
      // Add conversation history if provided
      if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
        // Insert conversation history before the current user message
        messages.unshift(...options.conversationHistory);
      }
      
      // Call Claude API with tools
      const response = await this.client.messages.create({
        model,
        system: systemPrompt,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
        top_k: options.topK || 40,
        tools,
      });
      
      // Process response to extract tool calls
      const result = {
        text: response.content[0].text,
        toolCalls: [],
      };
      
      // Extract tool calls if present
      if (response.content.length > 1) {
        for (const content of response.content) {
          if (content.type === 'tool_use') {
            result.toolCalls.push({
              name: content.name,
              arguments: content.input,
            });
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error generating response with Claude tools:', error);
      throw new Error(`Failed to generate response with tools: ${error.message}`);
    }
  }
  
  /**
   * Generate response with vision
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
        model = 'claude-3-opus-20240229',
      } = context;
      
      // Prepare content parts with text and images
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
          // Extract base64 data and mime type
          const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 image data');
          }
          
          const mimeType = matches[1];
          const base64Data = matches[2];
          
          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType,
              data: base64Data,
            },
          });
        } else {
          // Use URL directly
          content.push({
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl,
            },
          });
        }
      }
      
      // Call Claude API with vision
      const response = await this.client.messages.create({
        model,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
        top_k: options.topK || 40,
      });
      
      // Extract and return the response text
      return response.content[0].text;
    } catch (error) {
      console.error('Error generating vision response with Claude:', error);
      throw new Error(`Failed to generate vision response: ${error.message}`);
    }
  }
}

module.exports = ClaudeService;
