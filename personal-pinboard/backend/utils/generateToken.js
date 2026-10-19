import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const payload = {
    id: user.id || user._id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
  };

  const secret = process.env.JWT_SECRET || 'super_secret_pinboard_jwt_key_2026_rupp';
  return jwt.sign(payload, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
