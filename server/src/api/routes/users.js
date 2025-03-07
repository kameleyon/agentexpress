const express = require('express');
const Joi = require('joi');
const router = express.Router();

/**
 * Validation schema for updating user
 */
const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  avatar_url: Joi.string().uri().allow(null, ''),
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
 * Middleware to check if user is admin
 */
const isAdmin = async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    
    // Get user profile from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    if (userError) {
      throw userError;
    }
    
    // Check if user is admin
    if (userData.role !== 'admin') {
      const error = new Error('Admin access required');
      error.name = 'ForbiddenError';
      throw error;
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * @route GET /api/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
router.get('/', authenticate, isAdmin, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    
    // Get all users from database
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // Format user data
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
    
    // Return users
    res.json({ users: formattedUsers });
  } catch (err) {
    next(err);
  }
});

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.params.id;
    
    // Check if user is requesting their own profile or is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    if (userError) {
      throw userError;
    }
    
    if (req.user.id !== userId && userData.role !== 'admin') {
      const error = new Error('Unauthorized to access this user');
      error.name = 'ForbiddenError';
      throw error;
    }
    
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Return user data
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route PUT /api/users/:id
 * @desc Update user
 * @access Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.params.id;
    
    // Check if user is updating their own profile or is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();
    
    if (userError) {
      throw userError;
    }
    
    if (req.user.id !== userId && userData.role !== 'admin') {
      const error = new Error('Unauthorized to update this user');
      error.name = 'ForbiddenError';
      throw error;
    }
    
    // Validate request body
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      error.name = 'ValidationError';
      throw error;
    }
    
    // Prepare update data
    const updateData = {};
    if (value.firstName) updateData.first_name = value.firstName;
    if (value.lastName) updateData.last_name = value.lastName;
    if (value.avatar_url !== undefined) updateData.avatar_url = value.avatar_url;
    
    // Update user in database
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    // Return updated user data
    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatar_url,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private/Admin
 */
router.delete('/:id', authenticate, isAdmin, async (req, res, next) => {
  try {
    const supabase = req.app.locals.supabase;
    const userId = req.params.id;
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Delete user from database
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Delete user from Supabase Auth
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      // Log error but don't fail the request
      req.app.locals.logger.error('Error deleting user from Supabase Auth:', authDeleteError);
    }
    
    // Return success response
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
