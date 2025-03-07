const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * Validation schema for registration
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

/**
 * Validation schema for login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      error.name = 'ValidationError';
      throw error;
    }

    const { email, password, firstName, lastName } = value;
    const supabase = req.app.locals.supabase;
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      const error = new Error('User already exists');
      error.name = 'ValidationError';
      throw error;
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    // Create user profile in the database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      error.name = 'ValidationError';
      throw error;
    }

    const { email, password } = value;
    const supabase = req.app.locals.supabase;

    // Sign in with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      const error = new Error('Invalid credentials');
      error.name = 'UnauthorizedError';
      throw error;
    }

    // Get user profile from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      throw userError;
    }

    // Return JWT token and user data
    res.json({
      token: data.session.access_token,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    
    // Get JWT token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(200).json({ message: 'Logged out successfully' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Sign out from Supabase Auth
    await supabase.auth.signOut();
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', async (req, res, next) => {
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
    
    // Get user profile from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      throw userError;
    }
    
    // Return user data
    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
