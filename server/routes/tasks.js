const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const { Task, Category } = require('../models');

const generateSmartSuggestions = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  const suggestions = [];

  if (text.includes('complex') || text.includes('project') || text.includes('multi-step')) {
    suggestions.push(
      'Break into smaller tasks',
      'Assign deadlines to each part',
      'Identify dependencies',
      'Review after each step'
    );
  }

  if (text.includes('learn') || text.includes('study') || text.includes('read')) {
    suggestions.push(
      'Schedule focused study blocks',
      'Take notes while learning',
      'Test your understanding afterward'
    );
  }

  if (text.includes('api') || text.includes('backend') || text.includes('integration')) {
    suggestions.push(
      'Write and test API endpoints individually',
      'Use Postman or Insomnia for manual testing',
      'Document each route'
    );
  }

  if (suggestions.length === 0) {
    suggestions.push('Start with a clear first step');
  }

  return suggestions;
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Category,
          as: 'category', // ✅ Required alias
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(tasks);

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});


// POST /api/tasks - Create a new task
router.post('/', authMiddleware, async (req, res) => {
  const { title, description = '', category_id = null, due_date = null } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }

  // Validate due_date if provided
  if (due_date && isNaN(Date.parse(due_date))) {
    return res.status(400).json({ error: 'Invalid due date format' });
  }

  // Check category ownership if category_id is provided
  if (category_id) {
    try {
      const category = await Category.findOne({
        where: {
          id: category_id,
        },
      });

      if (!category) {
        return res.status(400).json({ error: 'Invalid category ID' });
      }
    } catch (err) {
      console.error('Error verifying category ownership:', err);
      return res.status(500).json({ error: 'Server error while verifying category' });
    }
  }

  // Priority and estimate based on description content
  const descLower = description.toLowerCase();
  let priority = 'Low';
  if (descLower.includes('urgent') || descLower.includes('complex')) priority = 'High';
  else if (description.length > 50) priority = 'Medium';

  let estimate = '30 mins';
  if (description.length > 100 || descLower.includes('complex')) estimate = '2 hrs';

  // Generate suggestions BEFORE creating task
  const smartSuggestions = generateSmartSuggestions(title, description);

  try {
    const newTask = await Task.create({
      user_id: req.user.userId,
      title,
      description,
      category_id,
      priority,
      estimate,
      due_date,
      suggestions: smartSuggestions,   // <-- Save suggestions in DB here
    });

    res.status(201).json(newTask); // The saved task includes suggestions now
    
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Server error while creating task' });
  }
});


// POST /api/tasks/suggestions - Generate smart suggestions without creating a task
router.post('/suggestions', authMiddleware, (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Both title and description are required' });
  }

  const suggestions = generateSmartSuggestions(title, description);
  res.json({ suggestions });
});


// PUT /api/tasks/:id - Update a task by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.userId, // Ensures ownership
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const {
      title,
      description,
      category_id,
      priority,
      estimate,
      due_date,
      completed,
    } = req.body;

    // Optional: Validate new category belongs to user
    if (category_id) {
      const category = await Category.findOne({
        where: {
          id: category_id,
        },
      });

      if (!category) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    // Update task fields
    await task.update({
      title: title ?? task.title,
      description: description ?? task.description,
      category_id: category_id ?? task.category_id,
      priority: priority ?? task.priority,
      estimate: estimate ?? task.estimate,
      due_date: due_date ?? task.due_date,
      completed: completed ?? task.completed,
    });

    res.json({ message: 'Task updated successfully', task });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Server error while updating task' });
  }
});


// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.userId, // ← this matches your earlier pattern
      },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Server error while deleting task' });
  }
});

module.exports = router;
