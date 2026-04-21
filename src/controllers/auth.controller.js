import * as authService from '../services/auth.service.js';

// Handles user identity and access management
export const register = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = authService.createUser(username, password);
    res.status(201).json({ 
      success: true, 
      message: 'Identity provisioned successfully',
      id: user.id
    });
  } catch (error) {
    if (error.code === 'IDENTITY_CONFLICT') {
      return res.status(409).json({ error: error.message });
    }
    throw error;
  }
};
