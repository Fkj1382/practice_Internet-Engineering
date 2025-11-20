const User = require('../models/user');

const getAllUsers = (req, res) => {
  res.json(User.getAllUsers());
};

const getUserById = (req, res, next) => {
  const user = User.getUserById(req.params.id);
  if (!user) {
    const error = new Error('کاربر یافت نشد (User not found)');
    error.status = 404;
    return next(error); // ارسال به مدیریت خطای سراسری
  }
  res.json(user);
};

const createUser = (req, res, next) => {
  const { name, age } = req.body;
  if (!name || !age) {
    const error = new Error('نام و سن الزامی است (Name and age required)');
    error.status = 400;
    return next(error);
  }
  const newUser = User.createUser(name, age);
  res.status(201).json(newUser);
};

const deleteUser = (req, res, next) => {
  const success = User.deleteUser(req.params.id);
  if (!success) {
    const error = new Error('کاربر برای حذف یافت نشد');
    error.status = 404;
    return next(error);
  }
  res.status(204).send();
};

module.exports = { getAllUsers, getUserById, createUser, deleteUser };