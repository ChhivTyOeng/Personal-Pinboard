import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_pinboard_jwt_key_2026_rupp';
    let decoded;

    // Handle mock tokens from frontend if present during transitions
    if (token.startsWith('mock-jwt-token-') || token.startsWith('frontend-jwt-token-')) {
      const mockId = token.replace('mock-jwt-token-', '').replace('frontend-jwt-token-', '');
      const user = await User.findById(mockId);
      if (user) {
        req.user = user;
        return next();
      }
    }

    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      // If token decoding fails, check if token was signed with fallback
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

// Optional auth for public feeds where we want to know current user if logged in
export const optionalProtect = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_pinboard_jwt_key_2026_rupp';
    if (token.startsWith('mock-jwt-token-') || token.startsWith('frontend-jwt-token-')) {
      const mockId = token.replace('mock-jwt-token-', '').replace('frontend-jwt-token-', '');
      req.user = await User.findById(mockId);
      return next();
    }
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
  } catch (e) {
    req.user = null;
  }
  next();
};

export default protect;
