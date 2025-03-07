/**
 * Agent Service
 * Provides core functionality for working with AI agents
 */
const { createClient } = require('@supabase/supabase-js');
const config = require('../../config');
const OpenRouterService = require('./providers/openRouterService');
const OpenAIService = require('./providers/openaiService');
const GeminiService = require('./providers/geminiService');
const ClaudeService = require('./providers/claudeService');

// Initialize Supabase client
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey
);

/**
 * Agent types
 */
const AgentType = {
  SOCIAL_MEDIA: 'social_media',
  CUSTOMER_SERVICE: 'customer_service',
  CONTENT_CREATION: 'content_creation',
  EDUCATIONAL: 'educational',
};

/**
 * Agent provider types
 */
const ProviderType = {
  OPENROUTER: 'openrouter', // Primary provider
  OPENAI: 'openai',
  GEMINI: 'gemini',
  CLAUDE: 'claude',
};

/**
 * Service mode for determining which service to use
 */
const ServiceMode = {
  OPENROUTER_ONLY: 'openrouter_only',
  DIRECT_ONLY: 'direct_only',
  HYBRID: 'hybrid', // Default mode
};

// Initialize OpenRouter service (primary)
let openRouterService;
try {
  openRouterService = new OpenRouterService(config.apiKeys.openrouter);
} catch (error) {
  console.warn('Failed to initialize OpenRouter service:', error.message);
}

/**
 * Get AI service based on provider type and mode
 * @param {string} providerType - Provider type
 * @param {string} mode - Service mode
 * @param {Object} options - Additional options
 * @returns {Object} AI service
 */
const getAIService = (providerType, mode = ServiceMode.HYBRID, options = {}) => {
  // If mode is OPENROUTER_ONLY, always use OpenRouter
  if (mode === ServiceMode.OPENROUTER_ONLY) {
    if (!openRouterService) {
      throw new Error('OpenRouter service is not available');
    }
    return openRouterService;
  }
  
  // If mode is DIRECT_ONLY, always use direct provider
  if (mode === ServiceMode.DIRECT_ONLY) {
    return getDirectService(providerType);
  }
  
  // In HYBRID mode (default)
  // Use OpenRouter for standard completions if available
  if (providerType === ProviderType.OPENROUTER && openRouterService) {
    return openRouterService;
  }
  
  // For specific features or if OpenRouter is not available, use direct provider
  if (options.useDirectService || !openRouterService) {
    return getDirectService(providerType);
  }
  
  // Default to OpenRouter in hybrid mode
  if (openRouterService) {
    return openRouterService;
  }
  
  // Fallback to direct service if OpenRouter is not available
  return getDirectService(providerType);
};

/**
 * Get direct service based on provider type
 * @param {string} providerType - Provider type
 * @returns {Object} AI service
 */
const getDirectService = (providerType) => {
  switch (providerType) {
    case ProviderType.OPENAI:
      return new OpenAIService(config.apiKeys.openai);
    case ProviderType.GEMINI:
      return new GeminiService(config.apiKeys.gemini);
    case ProviderType.CLAUDE:
      return new ClaudeService(config.apiKeys.claude);
    case ProviderType.OPENROUTER:
      if (openRouterService) {
        return openRouterService;
      }
      throw new Error('OpenRouter service is not available');
    default:
      throw new Error(`Unsupported provider type: ${providerType}`);
  }
};

/**
 * Create a new agent
 * @param {Object} agentData - Agent data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created agent
 */
const createAgent = async (agentData, userId) => {
  try {
    const { name, description, type, capabilities, isPublic = false } = agentData;
    
    // Create agent in database
    const { data: agent, error } = await supabase
      .from('agents')
      .insert([
        {
          name,
          description,
          type,
          capabilities,
          is_public: isPublic,
          creator_id: userId,
        },
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      capabilities: agent.capabilities,
      isPublic: agent.is_public,
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
    };
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

/**
 * Get agent by ID
 * @param {string} agentId - Agent ID
 * @returns {Promise<Object>} Agent
 */
const getAgentById = async (agentId) => {
  try {
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*, creator:creator_id(id, email, first_name, last_name)')
      .eq('id', agentId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!agent) {
      throw new Error('Agent not found');
    }
    
    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      capabilities: agent.capabilities,
      isPublic: agent.is_public,
      creator: agent.creator ? {
        id: agent.creator.id,
        email: agent.creator.email,
        firstName: agent.creator.first_name,
        lastName: agent.creator.last_name,
      } : null,
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
    };
  } catch (error) {
    console.error('Error getting agent:', error);
    throw error;
  }
};

/**
 * Execute agent with prompt
 * @param {string} agentId - Agent ID
 * @param {string} prompt - User prompt
 * @param {string} userId - User ID
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Agent response
 */
const executeAgent = async (agentId, prompt, userId, options = {}) => {
  try {
    // Get agent from database
    const agent = await getAgentById(agentId);
    
    // Get AI service based on agent capabilities
    const providerType = agent.capabilities.provider || ProviderType.OPENAI;
    const aiService = getAIService(providerType);
    
    // Prepare context and system prompt based on agent type
    const context = prepareAgentContext(agent);
    
    // Execute AI service with prompt
    const response = await aiService.generateResponse(prompt, context, options);
    
    // Log agent execution
    await logAgentExecution(agentId, userId, prompt, response);
    
    return {
      agentId,
      response,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error executing agent:', error);
    throw error;
  }
};

/**
 * Prepare agent context based on agent type and capabilities
 * @param {Object} agent - Agent
 * @returns {Object} Agent context
 */
const prepareAgentContext = (agent) => {
  // Base context for all agents
  const baseContext = {
    systemPrompt: `You are an AI assistant named ${agent.name}. ${agent.description}`,
    temperature: agent.capabilities.temperature || 0.7,
    maxTokens: agent.capabilities.maxTokens || 1000,
  };
  
  // Add type-specific context
  switch (agent.type) {
    case AgentType.SOCIAL_MEDIA:
      return {
        ...baseContext,
        systemPrompt: `${baseContext.systemPrompt} You are a social media expert who helps create engaging content, manage social media accounts, and analyze social media performance. You write in a conversational, engaging tone appropriate for social media platforms.`,
      };
    case AgentType.CUSTOMER_SERVICE:
      return {
        ...baseContext,
        systemPrompt: `${baseContext.systemPrompt} You are a customer service representative who helps users with their questions and issues. You are polite, helpful, and focused on resolving customer problems efficiently.`,
        temperature: 0.5, // Lower temperature for more consistent responses
      };
    case AgentType.CONTENT_CREATION:
      return {
        ...baseContext,
        systemPrompt: `${baseContext.systemPrompt} You are a content creation assistant who helps create high-quality written content such as blog posts, articles, marketing copy, and more. You write in a clear, engaging style and can adapt to different tones and formats.`,
        temperature: 0.8, // Higher temperature for more creative responses
      };
    case AgentType.EDUCATIONAL:
      return {
        ...baseContext,
        systemPrompt: `${baseContext.systemPrompt} You are an educational assistant who helps create learning materials, answer questions, and explain complex concepts in an easy-to-understand way. You provide accurate, helpful information and can adapt your explanations to different knowledge levels.`,
      };
    default:
      return baseContext;
  }
};

/**
 * Log agent execution
 * @param {string} agentId - Agent ID
 * @param {string} userId - User ID
 * @param {string} input - User input
 * @param {string} output - Agent output
 * @returns {Promise<void>}
 */
const logAgentExecution = async (agentId, userId, input, output) => {
  try {
    await supabase
      .from('agent_logs')
      .insert([
        {
          agent_id: agentId,
          user_id: userId,
          input,
          output,
          metadata: {
            timestamp: new Date().toISOString(),
            ip: null, // Don't store IP for privacy
          },
        },
      ]);
  } catch (error) {
    console.error('Error logging agent execution:', error);
    // Don't throw error to avoid disrupting the main flow
  }
};

module.exports = {
  AgentType,
  ProviderType,
  createAgent,
  getAgentById,
  executeAgent,
  prepareAgentContext,
};
