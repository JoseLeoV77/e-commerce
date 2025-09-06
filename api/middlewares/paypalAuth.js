import jwt from 'jsonwebtoken';
import 'dotenv/config'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Decodes the token and returns the payload
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // Every subsequent function in the chain can access `req.user`
    req.user = decodedPayload;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
    }
    return res.status(403).json({ error: 'Forbidden: Invalid token.' });
  }
};

export default authMiddleware;