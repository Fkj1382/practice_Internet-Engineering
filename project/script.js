// script.js
const taskInput = document.getElementById('taskInput');
const addBtn    = document.getElementById('addBtn');
const taskList  = document.getElementById('taskList');

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({ text: li.textContent, done: li.classList.contains('done') });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(text, done=false) {
  const li = document.createElement('li');
  li.textContent = text;
  if (done) li.classList.add('done');
  li.addEventListener('click', () => { li.classList.toggle('done'); saveTasks(); });
  li.addEventListener('contextmenu', e => { e.preventDefault(); li.remove(); saveTasks(); });
  taskList.appendChild(li);
  saveTasks();
}

addBtn.addEventListener('click', () => {
  if (taskInput.value.trim()) {
    addTask(taskInput.value);
    taskInput.value = '';
  }
});

// بارگذاری اولیه
const saved = JSON.parse(localStorage.getItem('tasks') || '[]');
saved.forEach(t => addTask(t.text, t.done));