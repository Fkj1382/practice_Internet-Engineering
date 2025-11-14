const listElement = document.getElementById('list');
const inputElement = document.getElementById('newTodo');

// Fetches all todos from the API
const fetchTodos = async () => {
  try {
    const res = await fetch('/api/todos');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    // Optionally display an error message to the user
    return [];
  }
};

// Renders the list of todos in the DOM
const renderTodos = (todos) => {
  listElement.innerHTML = '';
  const fragment = document.createDocumentFragment();

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.done ? 'done' : '';

    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = todo.text;
    taskTextSpan.addEventListener('click', () => toggleTodo(todo.id)); // Toggle on text click

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent li click event (toggle)
      deleteTodo(todo.id);
    });

    li.appendChild(taskTextSpan);
    li.appendChild(deleteBtn);
    fragment.appendChild(li);
  });

  listElement.appendChild(fragment);
};

// Loads and renders todos on page load or update
const loadTodos = async () => {
  const todos = await fetchTodos();
  renderTodos(todos);
};

// Adds a new todo to the list
const addTodo = async () => {
  const text = inputElement.value.trim();
  if (!text) {
    alert('Please enter a task!'); // Simple validation
    return;
  }

  try {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (res.ok) {
      inputElement.value = ''; // Clear input
      await loadTodos();
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to add todo.');
    }
  } catch (error) {
    console.error('Error adding todo:', error);
    alert(`Could not add task: ${error.message}`);
  }
};

// Toggles the 'done' status of a todo
const toggleTodo = async (id) => {
  try {
    const res = await fetch(`/api/todos/${id}`, { method: 'PUT' });
    if (res.ok) {
      await loadTodos();
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to toggle todo status.');
    }
  } catch (error) {
    console.error('Error toggling todo:', error);
    alert(`Could not toggle task status: ${error.message}`);
  }
};

// Deletes a todo from the list
const deleteTodo = async (id) => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return; // User cancelled
  }

  try {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadTodos();
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete todo.');
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert(`Could not delete task: ${error.message}`);
  }
};

// Load todos when the script first runs
loadTodos();

// Allow adding todo by pressing Enter key
inputElement.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});