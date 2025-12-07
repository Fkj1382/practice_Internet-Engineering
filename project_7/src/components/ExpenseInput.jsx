import React, { useState } from 'react';
import { addExpense } from '../services/apiClient.js';

const PEOPLE = ['علی', 'سارا', 'مجتبی']; 

function ExpenseInput({ onExpenseAdded }) {
  const [paidBy, setPaidBy] = useState(PEOPLE[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const expenseData = {
      paidBy: paidBy,
      amount: parseFloat(amount), 
      description: description,
    };

    if (isNaN(expenseData.amount) || expenseData.amount <= 0) {
        setError('لطفاً مبلغ معتبری وارد کنید.');
        setLoading(false);
        return;
    }
    
    try {
      await addExpense(expenseData); 
      
      setAmount('');
      setDescription('');

      if (onExpenseAdded) {
        onExpenseAdded(); 
      }
    } catch (err) {
      setError('خطا در ثبت هزینه. لطفاً از فعال بودن بک‌اند اطمینان حاصل کنید.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">ثبت هزینه جدید</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">پرداخت کننده:</label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            {PEOPLE.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">مبلغ (تومان):</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="مثال: 60000"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="مثال: خرید مواد غذایی"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'در حال ارسال...' : 'ثبت هزینه'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseInput;