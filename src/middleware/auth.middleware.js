import * as authService from '../services/auth.service.js';

// Authentication Middleware Validates requests using hardened cryptographic checks
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Missing authorization header' 
    });
  }

  try {
    const authType = authHeader.split(' ')[0];
    if (authType !== 'Basic') {
      throw new Error('Unsupported auth type');
    }

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');
    
    const user = authService.authenticateUser(username, password);

    if (user) {
      req.user = user;
      return next();
    }

    res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Invalid credentials provided' 
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Malformed authorization token' 
    });
  }
};
