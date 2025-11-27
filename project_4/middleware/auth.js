const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    const error = new Error('Unauthorized: کلید API نامعتبر است');
    error.status = 401;
    return next(error);
  }
  next();
};
module.exports = auth;