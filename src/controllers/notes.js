const { Note, User } = require('../models');

const noteController = {
  // Create a new note
  create: async (req, res, next) => {
    try {
      const { user_id, title, content } = req.body;

      // Validate input
      if (!user_id || !title) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'User ID and title are required'
        });
      }

      // Verify user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      // Create note
      const note = await Note.create({
        user_id,
        title,
        content: content || ''
      });

      res.status(201).json({
        message: 'Note created successfully',
        note
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.errors.map(e => e.message)
        });
      }
      next(error);
    }
  },

  // Get all notes for a specific user
  getAllByUser: async (req, res, next) => {
    try {
      const { user_id } = req.params;

      // Verify user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      const notes = await Note.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }]
      });

      res.status(200).json({
        count: notes.length,
        notes
      });
    } catch (error) {
      next(error);
    }
  },

  // Get a specific note by ID
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const note = await Note.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }]
      });

      if (!note) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Note not found'
        });
      }

      res.status(200).json({ note });
    } catch (error) {
      next(error);
    }
  },

  // Update a note
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const note = await Note.findByPk(id);

      if (!note) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Note not found'
        });
      }

      // Update fields
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;

      await note.save();

      res.status(200).json({
        message: 'Note updated successfully',
        note
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.errors.map(e => e.message)
        });
      }
      next(error);
    }
  },

  // Delete a note
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const note = await Note.findByPk(id);

      if (!note) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Note not found'
        });
      }

      await note.destroy();

      res.status(200).json({
        message: 'Note deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all notes (for testing purposes)
  getAll: async (req, res, next) => {
    try {
      const notes = await Note.findAll({
        order: [['created_at', 'DESC']],
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }]
      });

      res.status(200).json({
        count: notes.length,
        notes
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = noteController;