require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/user');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'تعداد درخواست‌های شما بیش از حد مجاز است.' }
});
app.use(limiter);

app.use('/users', auth, userRoutes);


app.use(errorHandler);

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`✅ Secure Server running at https://localhost:${port}`);
});