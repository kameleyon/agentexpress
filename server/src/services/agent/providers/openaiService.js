/**
 * OpenAI Service
 * Handles interactions with the OpenAI API
 */
const { OpenAI } = require('openai');

class OpenAIService {
  /**
   * Constructor
   * @param {string} apiKey - OpenAI API key
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    this.client = new OpenAI({
      apiKey,
    });
  }
  
  /**
   * Generate response using OpenAI API
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
        model = 'gpt-4-turbo',
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
      
      // Call OpenAI API
      const response = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
      });
      
      // Extract and return the response text
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response with OpenAI:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
  
  /**
   * Generate embeddings for text
   * @param {string} text - Text to generate embeddings for
   * @returns {Promise<Array<number>>} Embeddings
   */
  async generateEmbeddings(text) {
    try {
      const response = await this.client.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embeddings with OpenAI:', error);
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }
  
  /**
   * Moderate content using OpenAI's moderation API
   * @param {string} content - Content to moderate
   * @returns {Promise<Object>} Moderation results
   */
  async moderateContent(content) {
    try {
      const response = await this.client.moderations.create({
        input: content,
      });
      
      return {
        flagged: response.results[0].flagged,
        categories: response.results[0].categories,
        categoryScores: response.results[0].category_scores,
      };
    } catch (error) {
      console.error('Error moderating content with OpenAI:', error);
      throw new Error(`Failed to moderate content: ${error.message}`);
    }
  }
  
  /**
   * Generate image from text prompt
   * @param {string} prompt - Text prompt
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Generated image URL
   */
  async generateImage(prompt, options = {}) {
    try {
      const {
        size = '1024x1024',
        quality = 'standard',
        style = 'natural',
      } = options;
      
      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality,
        style,
      });
      
      return response.data[0].url;
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;
