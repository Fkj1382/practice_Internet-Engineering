const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            todos: [
                { _id: 1, title: 'خرید شیر', status: 'pending' },
                { _id: 2, title: 'انجام پروژه EJS', status: 'done' }
            ],
            nextId: 3
        };
    }
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let { todos, nextId } = loadData();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.message = req.query.message ? decodeURIComponent(req.query.message) : null;
    res.locals.error = req.query.error ? decodeURIComponent(req.query.error) : null;
    next();
});

app.get('/', (req, res) => {
    const filter = req.query.filter || 'all';
    const search = req.query.search ? req.query.search.trim() : '';
    
    let filteredTodos = todos;

    if (filter !== 'all') {
        filteredTodos = filteredTodos.filter(t => t.status === filter);
    }

    if (search) {
        filteredTodos = filteredTodos.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.render('index', { 
        todos: filteredTodos,
        currentFilter: filter,
        currentSearch: search
    });
});

app.post('/add', (req, res) => {
    const title = req.body.title ? req.body.title.trim() : '';

    if (!title) {
        return res.redirect('/?error=' + encodeURIComponent('عنوان کار نمی‌تواند خالی باشد.'));
    }

    const newTodo = {
        _id: nextId++,
        title: title,
        status: 'pending'
    };
    todos.push(newTodo);
    saveData({ todos, nextId });
    res.redirect('/?message=' + encodeURIComponent('کار جدید با موفقیت اضافه شد.'));
});

app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t._id === id);
    
    if (todo) {
        res.locals.error = req.query.error ? decodeURIComponent(req.query.error) : null;
        res.render('edit', { todo: todo });
    } else {
        res.status(404).render('404', { message: 'کار مورد نظر برای ویرایش پیدا نشد.' });
    }
});

app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t._id === id);
    const title = req.body.title ? req.body.title.trim() : '';

    if (todoIndex === -1) {
        return res.status(404).render('404', { message: 'کار مورد نظر برای به‌روزرسانی پیدا نشد.' });
    }
    
    if (!title) {
        return res.redirect(`/edit/${id}?error=${encodeURIComponent('عنوان کار نمی‌تواند خالی باشد.')}`);
    }

    todos[todoIndex].title = title;
    todos[todoIndex].status = req.body.status;
    
    saveData({ todos, nextId });
    res.redirect('/?message=' + encodeURIComponent('کار با موفقیت به‌روزرسانی شد.'));
});

app.get('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    
    todos = todos.filter(t => t._id !== id);
    
    if (todos.length < initialLength) {
        saveData({ todos, nextId });
        res.redirect('/?message=' + encodeURIComponent('کار با موفقیت حذف شد.'));
    } else {
        res.redirect('/?error=' + encodeURIComponent('کار مورد نظر برای حذف پیدا نشد.'));
    }
});

app.use((req, res, next) => {
    res.status(404).render('404', { message: 'صفحه مورد نظر شما پیدا نشد.' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});