require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const userRoutes = require('./routes/user');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

// 1. Global Middleware (Early in the stack)
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan('dev')); // لاگ‌گیری درخواست‌ها

// 2. Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { 
    success: false, 
    error: { 
      message: 'تعداد درخواست‌های شما بیش از حد مجاز است.', 
      status: 429, 
      details: null 
    } 
  }
});
app.use(limiter);

// 3. CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const error = new Error(`Not allowed by CORS policy. Origin: ${origin}`);
      error.status = 403;
      callback(error);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['x-api-key', 'Content-Type'],
  optionsSuccessStatus: 200
};

// 4. Response Formatter Middleware (اصلاح شده)
const formatResponse = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    
    // اگر کد وضعیت 400 یا بالاتر باشد، یعنی خطا رخ داده است (توسط errorHandler تنظیم شده).
    // در این صورت، قالب success: true را اعمال نمی‌کنیم تا ساختار خطا حفظ شود.
    if (res.statusCode >= 400) {
        return originalJson.call(this, data);
    }
      
    // برای کد 204 No Content، بدنه پاسخ خالی می‌ماند.
    if (res.statusCode === 204) return originalJson.call(this); 
    
    // اعمال قالب استاندارد برای پاسخ‌های موفقیت‌آمیز
    return originalJson.call(this, {
      success: true,
      data: data || null,
      timestamp: new Date().toISOString()
    });
  };
  next();
};
app.use(formatResponse);

// 5. Routes
app.get('/', (req, res) => {
  res.send('API is running securely over HTTPS!');
});

// اعمال CORS و Auth بر روی مسیر /users
app.use('/users', cors(corsOptions), auth, userRoutes);

// 6. Global Error Handler (باید در انتهای مسیر باشد)
app.use(errorHandler);

// 7. Start Server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`✅ Secure Server running at https://localhost:${port}`);
});

// 8. Exports
module.exports = { auth };