import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

export default authMiddleware;