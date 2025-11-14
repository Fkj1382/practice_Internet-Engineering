const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

let todos = [];
let nextId = 1;

// GET all todos
app.get('/api/todos', (req, res) => res.json(todos));

// POST a new todo
app.post('/api/todos', (req, res) => {
  if (!req.body.text || req.body.text.trim() === '') {
    return res.status(400).json({ error: 'Task text cannot be empty.' });
  }

  const newTodo = { id: nextId++, text: req.body.text.trim(), done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT (toggle status) a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found.' });
  }

  todos[todoIndex].done = !todos[todoIndex].done;
  res.json(todos[todoIndex]);
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  
  todos = todos.filter(t => t.id !== id);
  
  if (todos.length === initialLength) { // If length hasn't changed, todo was not found
    return res.status(404).json({ error: 'Todo not found.' });
  }

  res.status(204).send(); // 204 No Content for successful deletion
});

// Generic 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));