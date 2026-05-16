const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Secret should be in .env, using fallback for demo
const JWT_SECRET = process.env.JWT_SECRET || 'atomquest_hackathon_super_secret_key';

// Middleware to authenticate user via JWT
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, department: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route. Requires: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize, JWT_SECRET };
