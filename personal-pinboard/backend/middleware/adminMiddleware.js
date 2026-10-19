export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const role = (req.user.role || '').toLowerCase();
  const isAdmin = role === 'admin' || req.user.username === 'admin';

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required',
    });
  }

  next();
};

export default adminOnly;
