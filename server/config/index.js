const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_staff_db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expire: process.env.JWT_EXPIRE || '7d'
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};