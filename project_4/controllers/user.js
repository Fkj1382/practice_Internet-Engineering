const User = require('../models/user');
const asyncHandler = require('../middleware/asyncHandler'); 
const { body, validationResult } = require('express-validator');

const userValidationRules = [
  body('name').isString().trim().notEmpty().withMessage('Name must be a non-empty string'),
  body('age').isInt({ min: 1 }).withMessage('Age must be a positive integer')
];

const UserAsync = {
  getAllUsers: async () => User.getAllUsers(),
  getUserById: async (id) => User.getUserById(id),
  createUser: async (name, age) => User.createUser(name, age),
  updateUser: async (id, name, age) => User.updateUser(id, name, age),
  deleteUser: async (id) => User.deleteUser(id)
};

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserAsync.getAllUsers();
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await UserAsync.getUserById(req.params.id);
  if (!user) {
    throw Object.assign(new Error('کاربر یافت نشد (User not found)'), { status: 404 });
  }
  res.json(user);
});

const createUser = [
  ...userValidationRules,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw Object.assign(new Error('Validation failed'), { status: 400, details: errors.array() });
    }
    
    const { name, age } = req.body;
    const newUser = await UserAsync.createUser(name, age);
    res.status(201).json(newUser);
  })
];

const updateUser = [
  ...userValidationRules,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw Object.assign(new Error('Validation failed'), { status: 400, details: errors.array() });
    }
    
    const { name, age } = req.body;
    const updatedUser = await UserAsync.updateUser(req.params.id, name, age);
    
    if (!updatedUser) {
      throw Object.assign(new Error('کاربر برای به‌روزرسانی یافت نشد'), { status: 404 });
    }
    res.json(updatedUser);
  })
];

const deleteUser = asyncHandler(async (req, res) => {
  const success = await UserAsync.deleteUser(req.params.id);
  if (!success) {
    throw Object.assign(new Error('کاربر برای حذف یافت نشد'), { status: 404 });
  }
  res.status(204).send();
});

module.exports = { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser,
  deleteUser 
};