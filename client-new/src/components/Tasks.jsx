// src/components/Tasks.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTasks,
  addTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
} from '../redux/slices/taskSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import './Tasks.css'; // Custom styles

const Tasks = () => {
  const dispatch = useDispatch();

  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { categories, error: categoriesError, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { token, user } = useSelector((state) => state.auth);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editCategory, setEditCategory] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks());
      dispatch(fetchCategories());
    }
  }, [dispatch, token]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    if (!selectedCategory) return alert('Please select a category.');

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription || '',
      priority: newTaskPriority || 'Normal',
      category_id: selectedCategory,
      completed: false,
    };

    try {
      await dispatch(addTaskAsync(newTask)).unwrap();
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('');
      setSelectedCategory('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleToggleComplete = (task) => {
    dispatch(updateTaskAsync({ ...task, completed: !task.completed }));
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTaskAsync(id));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditCategory(task.category_id);
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('');
    setEditCategory('');
  };

  const handleUpdateTask = async () => {
    const updatedTask = {
      id: editTaskId,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      category_id: editCategory,
      completed: false,
    };

    try {
      await dispatch(updateTaskAsync(updatedTask)).unwrap();
      cancelEditing();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Tasks</h2>
      {user && <p className="text-muted">Welcome, {user.username} ({user.email})</p>}

      {tasksLoading && <p>Loading tasks...</p>}
      {tasksError && <div className="alert alert-danger">{tasksError}</div>}
      {categoriesError && <div className="alert alert-danger">{categoriesError}</div>}

      <ul className="list-group mb-4">
        {tasks.map((task) => (
  <div key={task.id} className="card mb-3">
    <div className="card-body">
      {editTaskId === task.id ? (
        <>
          <input
            className="form-control mb-2"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            className="form-control mb-2"
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <select
            className="form-select mb-2"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
          <select
            className="form-select mb-2"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <button className="btn btn-success me-md-2" onClick={handleUpdateTask}>Save</button>
            <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex align-items-start mb-2">
            <input
              className="form-check-input me-2 mt-1"
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />
            <div className="flex-grow-1">
              <h5 className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                {task.title}
              </h5>
              <p className="mb-1">{task.description}</p>
              <span className="badge bg-info me-2">{task.priority}</span>
              <span className="badge bg-secondary">Category: {getCategoryName(task.category_id)}</span>
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
            <button className="btn btn-warning btn-sm me-md-2" onClick={() => startEditing(task)}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>&times;</button>
          </div>
        </>
      )}

      {Array.isArray(task.suggestions) && task.suggestions.length > 0 && (
        <div className="mt-3">
          <h6>Suggestions:</h6>
          <ul className="mb-0 ps-3">
            {task.suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
))}

      </ul>

      <div className="card p-3">
        <h5 className="mb-3">Add New Task</h5>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Task description (optional)"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <select
          className="form-select mb-2"
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
        <select
          className="form-select mb-3"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categoriesLoading && <option disabled>Loading categories...</option>}
          {categoriesError && <option disabled>Error loading categories</option>}
          {!categoriesLoading && !categoriesError && categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleAddTask}>
          Add Task
        </button>
      </div>
    </div>
  );
};

export default Tasks;
