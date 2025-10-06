console.log("Users CONTROLLER!!!!! loaded");

const { User } = require('../models');

const userController = {
  // Register a new user
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      console.log(username + " AAAAAAHHHH");//just a testing console log
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Username, email, and password are required'
        });
      }

      // Create user 
      const user = await User.create({
        username,
        email,
        password
      });

      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.errors.map(e => e.message)
        });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Username or email already exists'
        });
      }
      next(error);
    }
  },

  // Login user
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          error: 'Authentication Failed',
          message: 'Invalid email or password'
        });
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);

      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Authentication Failed',
          message: 'Invalid email or password'
        });
      }

      
      res.status(200).json({
        message: 'Login successful',
        user
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user profile by ID
  getProfile: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },

  // Get all users 
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });

      res.status(200).json({
        count: users.length,
        users
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;