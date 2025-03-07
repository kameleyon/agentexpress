/**
 * Gemini Service
 * Handles interactions with the Google Gemini API
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  /**
   * Constructor
   * @param {string} apiKey - Google API key
   */
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Google API key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
  }
  
  /**
   * Generate response using Gemini API
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
        model = 'gemini-pro',
      } = context;
      
      // Get the model
      const geminiModel = this.genAI.getGenerativeModel({ model });
      
      // Prepare chat session
      const chat = geminiModel.startChat({
        history: [],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: options.topP || 1,
          topK: options.topK || 40,
        },
      });
      
      // Add system prompt as first message
      await chat.sendMessage(systemPrompt);
      
      // Add conversation history if provided
      if (options.conversationHistory && Array.isArray(options.conversationHistory)) {
        for (const message of options.conversationHistory) {
          if (message.role === 'user') {
            await chat.sendMessage(message.content);
          }
          // Skip assistant messages as they'll be responses in the chat
        }
      }
      
      // Send user prompt and get response
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      
      // Extract and return the response text
      return response.text();
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
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
      const embeddingModel = this.genAI.getGenerativeModel({ model: 'embedding-001' });
      
      const result = await embeddingModel.embedContent(text);
      const embedding = result.embedding.values;
      
      return embedding;
    } catch (error) {
      console.error('Error generating embeddings with Gemini:', error);
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }
  
  /**
   * Generate multimodal response (text + images)
   * @param {string} prompt - Text prompt
   * @param {Array<string>} imageUrls - Array of image URLs or base64 strings
   * @param {Object} options - Additional options
   * @returns {Promise<string>} Generated response
   */
  async generateMultimodalResponse(prompt, imageUrls, options = {}) {
    try {
      const {
        temperature = 0.7,
        maxTokens = 1000,
      } = options;
      
      // Get the multimodal model
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      // Prepare parts array with text and images
      const parts = [{ text: prompt }];
      
      // Add images to parts
      for (const imageUrl of imageUrls) {
        // Check if it's a base64 string or URL
        if (imageUrl.startsWith('data:image')) {
          // Extract base64 data
          const base64Data = imageUrl.split(',')[1];
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg', // Assume JPEG for simplicity
            },
          });
        } else {
          // Fetch image from URL and convert to base64
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString('base64');
          
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: response.headers.get('content-type') || 'image/jpeg',
            },
          });
        }
      }
      
      // Generate content
      const result = await model.generateContent({
        contents: [{ parts }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: options.topP || 1,
          topK: options.topK || 40,
        },
      });
      
      const response = result.response;
      
      // Extract and return the response text
      return response.text();
    } catch (error) {
      console.error('Error generating multimodal response with Gemini:', error);
      throw new Error(`Failed to generate multimodal response: ${error.message}`);
    }
  }
  
  /**
   * Count tokens in text
   * @param {string} text - Text to count tokens for
   * @returns {Promise<number>} Token count
   */
  async countTokens(text) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.countTokens(text);
      return result.totalTokens;
    } catch (error) {
      console.error('Error counting tokens with Gemini:', error);
      throw new Error(`Failed to count tokens: ${error.message}`);
    }
  }
}

module.exports = GeminiService;
