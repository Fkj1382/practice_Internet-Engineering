const API_URL = '/users';
const API_KEY = 'my-secret-key-123'; 

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
};

async function fetchUsers() {
    const list = document.getElementById('userList');
    const loading = document.getElementById('loading');
    list.innerHTML = '';
    loading.style.display = 'block';

    try {
        const response = await fetch(API_URL, { headers });
        if (!response.ok) throw new Error('عدم دسترسی یا خطا در سرور');
        
        const users = await response.json();
        loading.style.display = 'none';

        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <span>👤 ${user.name}</span>
                    <span class="age">(سن: ${user.age})</span>
                </div>
                <button class="delete-btn" onclick="deleteUser(${user.id})">حذف</button>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        loading.innerText = 'خطا در دریافت اطلاعات: ' + error.message;
    }
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ name, age })
        });

        if (response.ok) {
            document.getElementById('name').value = '';
            document.getElementById('age').value = '';
            fetchUsers();
        } else {
            alert('خطا در ثبت کاربر');
        }
    } catch (error) {
        alert('مشکل در ارتباط با سرور');
    }
});

async function deleteUser(id) {
    if(!confirm('آیا مطمئن هستید؟')) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: headers
        });
        fetchUsers();
    } catch (error) {
        alert('خطا در حذف کاربر');
    }
}

fetchUsers();