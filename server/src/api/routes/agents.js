const express = require('express');
const Joi = require('joi');
const router = express.Router();

/**
 * Validation schema for creating agent
 */
const createAgentSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  capabilities: Joi.object().required(),
  isPublic: Joi.boolean().default(false),
});

/**
 * Validation schema for updating agent
 */
const updateAgentSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  type: Joi.string(),
  capabilities: Joi.object(),
  isPublic: Joi.boolean(),
}).min(1);

/**
 * Middleware to check if user is authenticated
 */
const authenticate = async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    
    // Get JWT token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('No token provided');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      const error = new Error('Invalid token');
      error.name = 'UnauthorizedError';
      throw error;
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * @route GET /api/agents
 * @desc Get all agents
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    
    // Get query parameters
    const { type, limit = 10, page = 1 } = req.query;
    
    // Build query
    let query = supabase
      .from('agents')
      .select('*, creator:creator_id(id, email, first_name, last_name)')
      .eq('is_public', true);
    
    // Filter by type if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: agents, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Format agent data
    const formattedAgents = agents.map(agent => ({
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
    }));
    
    // Return agents
    res.json({
      agents: formattedAgents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/agents/my
 * @desc Get user's agents
 * @access Private
 */
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    
    // Get query parameters
    const { type, limit = 10, page = 1 } = req.query;
    
    // Build query
    let query = supabase
      .from('agents')
      .select('*')
      .eq('creator_id', req.user.id);
    
    // Filter by type if provided
    if (type) {
      query = query.eq('type', type);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: agents, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    // Format agent data
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type,
      capabilities: agent.capabilities,
      isPublic: agent.is_public,
      createdAt: agent.created_at,
      updatedAt: agent.updated_at,
    }));
    
    // Return agents
    res.json({
      agents: formattedAgents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/agents/:id
 * @desc Get agent by ID
 * @access Public/Private
 */
router.get('/:id', async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const agentId = req.params.id;
    
    // Get agent from database
    const { data: agent, error } = await supabase
      .from('agents')
      .select('*, creator:creator_id(id, email, first_name, last_name)')
      .eq('id', agentId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!agent) {
      const error = new Error('Agent not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Check if agent is public or user is creator
    let isAuthorized = agent.is_public;
    
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      // Verify token with Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (!authError && user) {
        // Check if user is creator
        isAuthorized = isAuthorized || agent.creator_id === user.id;
        
        // Check if user is admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!userError && userData) {
          isAuthorized = isAuthorized || userData.role === 'admin';
        }
      }
    }
    
    if (!isAuthorized) {
      const error = new Error('Unauthorized to access this agent');
      error.name = 'ForbiddenError';
      throw error;
    }
    
    // Return agent data
    res.json({
      agent: {
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
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/agents
 * @desc Create a new agent
 * @access Private
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = createAgentSchema.validate(req.body);
    if (error) {
      error.name = 'ValidationError';
      throw error;
    }
    
    const { name, description, type, capabilities, isPublic } = value;
    const supabase = req.app.locals.supabase;
    
    // Create agent in database
    const { data: agent, error: createError } = await supabase
      .from('agents')
      .insert([
        {
          name,
          description,
          type,
          capabilities,
          is_public: isPublic,
          creator_id: req.user.id,
        },
      ])
      .select()
      .single();
    
    if (createError) {
      throw createError;
    }
    
    // Return success response
    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        type: agent.type,
        capabilities: agent.capabilities,
        isPublic: agent.is_public,
        createdAt: agent.created_at,
        updatedAt: agent.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route PUT /api/agents/:id
 * @desc Update agent
 * @access Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const agentId = req.params.id;
    
    // Check if agent exists and user is creator or admin
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('creator_id')
      .eq('id', agentId)
      .single();
    
    if (agentError || !agent) {
      const error = new Error('Agent not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Check if user is creator or admin
    let isAuthorized = agent.creator_id === req.user.id;
    
    // Check if user is admin
    if (!isAuthorized) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();
      
      if (!userError && userData) {
        isAuthorized = userData.role === 'admin';
      }
    }
    
    if (!isAuthorized) {
      const error = new Error('Unauthorized to update this agent');
      error.name = 'ForbiddenError';
      throw error;
    }
    
    // Validate request body
    const { error, value } = updateAgentSchema.validate(req.body);
    if (error) {
      error.name = 'ValidationError';
      throw error;
    }
    
    // Prepare update data
    const updateData = {};
    if (value.name) updateData.name = value.name;
    if (value.description) updateData.description = value.description;
    if (value.type) updateData.type = value.type;
    if (value.capabilities) updateData.capabilities = value.capabilities;
    if (value.isPublic !== undefined) updateData.is_public = value.isPublic;
    
    // Update agent in database
    const { data: updatedAgent, error: updateError } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', agentId)
      .select()
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    // Return updated agent data
    res.json({
      message: 'Agent updated successfully',
      agent: {
        id: updatedAgent.id,
        name: updatedAgent.name,
        description: updatedAgent.description,
        type: updatedAgent.type,
        capabilities: updatedAgent.capabilities,
        isPublic: updatedAgent.is_public,
        createdAt: updatedAgent.created_at,
        updatedAt: updatedAgent.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route DELETE /api/agents/:id
 * @desc Delete agent
 * @access Private
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const agentId = req.params.id;
    
    // Check if agent exists and user is creator or admin
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('creator_id')
      .eq('id', agentId)
      .single();
    
    if (agentError || !agent) {
      const error = new Error('Agent not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Check if user is creator or admin
    let isAuthorized = agent.creator_id === req.user.id;
    
    // Check if user is admin
    if (!isAuthorized) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();
      
      if (!userError && userData) {
        isAuthorized = userData.role === 'admin';
      }
    }
    
    if (!isAuthorized) {
      const error = new Error('Unauthorized to delete this agent');
      error.name = 'ForbiddenError';
      throw error;
    }
    
    // Delete agent from database
    const { error: deleteError } = await supabase
      .from('agents')
      .delete()
      .eq('id', agentId);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Return success response
    res.json({ message: 'Agent deleted successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/agents/:id/execute
 * @desc Execute an agent with a prompt
 * @access Private
 */
router.post('/:id/execute', authenticate, async (req, res, next) => {
  try {
    const agentId = req.params.id;
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      const error = new Error('Prompt is required');
      error.name = 'ValidationError';
      throw error;
    }
    
    // Get agent service
    const agentService = require('../../services/agent/agentService');
    
    // Execute agent
    const result = await agentService.executeAgent(agentId, prompt, req.user.id, options);
    
    // Return result
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
