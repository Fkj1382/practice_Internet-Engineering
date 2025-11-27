let users = [
  { id: 1, name: 'Ali', age: 25 },
  { id: 2, name: 'Sara', age: 30 }
];

const getAllUsers = () => users;
const getUserById = (id) => users.find(u => u.id === parseInt(id));

const createUser = (name, age) => {
  const newUser = { id: users.length + 1, name, age };
  users.push(newUser);
  return newUser;
};

const updateUser = (id, name, age) => {
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) return false;
    users[userIndex].name = name;
    users[userIndex].age = age;
    return users[userIndex];
};


const deleteUser = (id) => {
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) return false;
  users.splice(userIndex, 1);
  return true;
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };