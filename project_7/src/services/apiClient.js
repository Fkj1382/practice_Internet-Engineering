import axios from 'axios';

const API_BASE_URL = 'https://glowing-trout-pjwrx4p65576crwq7-3000.app.github.dev/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return []; 
  }
};

export const addExpense = async (expenseData) => {
  try {
    const response = await api.post('/expense', expenseData); 
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const getDebtSummary = async () => {
  try {
    const response = await api.get('/debt'); 
    return response.data;
  } catch (error) {
    console.error("Error fetching debt summary:", error);
    return {}; 
  }
};