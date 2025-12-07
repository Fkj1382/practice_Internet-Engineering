import React, { useState, useEffect, useCallback } from 'react';
// Lucide-react remains for icons, as they are independent of CSS framework
import { RefreshCw, DollarSign, List, Users, Plus } from 'lucide-react'; 
import axios from 'axios'; 

// --- API CLIENT LOGIC (Unchanged) ---
const API_BASE_URL = 'https://glowing-trout-pjwrx4p65576crwq7-3000.app.github.dev/api'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, 
});

const getExpenses = async () => {
    try {
        const response = await apiClient.get('/expenses');
        return response.data;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw error;
    }
};

const addExpense = async (expenseData) => {
    try {
        const response = await apiClient.post('/expense', expenseData);
        return response.data;
    } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
    }
};

const getDebtSummary = async () => {
    try {
        const response = await apiClient.get('/debt');
        return response.data;
    } catch (error) {
        console.error("Error fetching debt summary:", error);
        throw error;
    }
};
// --- End of API Logic ---

const PEOPLE = ['علی', 'سارا', 'مجتبی'];

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [debtSummary, setDebtSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newExpense, setNewExpense] = useState({ paidBy: PEOPLE[0], amount: '', description: '' });
    const [error, setError] = useState(null); 
    const [isAdding, setIsAdding] = useState(false);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const expensesData = await getExpenses();
            setExpenses(expensesData);
            
            const debtSummaryData = await getDebtSummary(); 
            setDebtSummary(debtSummaryData);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("خطا در ارتباط با سرور. مطمئن شوید سرور Node.js فعال و آدرس API صحیح است.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense(prev => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const amount = parseFloat(newExpense.amount);

        if (!newExpense.paidBy || amount <= 0 || isNaN(amount)) {
            setError('لطفاً فرد پرداخت‌کننده و مبلغ معتبر را وارد کنید.');
            return;
        }

        setIsAdding(true);
        setError(null);
        try {
            await addExpense({ ...newExpense, amount });
            
            await fetchAllData(); 
            setNewExpense({ paidBy: PEOPLE[0], amount: '', description: '' }); 
        } catch (err) {
            setError("خطا در ثبت هزینه. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsAdding(false);
        }
    };

    // --- Inline CSS Definitions ---
    const pageStyle = { minHeight: '100vh', backgroundColor: '#f9fafb', padding: '16px', fontFamily: 'sans-serif' };
    const headerTitleStyle = { fontSize: '40px', fontWeight: '800', color: '#3730a3', marginBottom: '8px' }; // indigo-800
    const cardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '1px solid #f3f4f6' };
    const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '12px', transition: 'all 0.15s ease-in-out' };
    const buttonStyle = { 
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px 16px', 
        backgroundColor: '#4f46e5', color: 'white', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out' 
    };

    if (loading && expenses.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', color: '#4f46e5', fontWeight: '600' }} dir="rtl">
                در حال بارگذاری داده‌ها...
            </div>
        );
    }

    return (
        <div style={pageStyle} dir="rtl">
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={headerTitleStyle}>
                    <DollarSign style={{ display: 'inline-block', width: '40px', height: '40px', verticalAlign: 'bottom', color: '#6366f1', marginLeft: '8px' }} />
                    SplitWise فارسی
                </h1>
                <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '18px' }}>
                    تقسیم هزینه‌ها بین {PEOPLE.join('، ')}
                </p>
                <button
                    onClick={fetchAllData}
                    disabled={loading || isAdding}
                    style={{ marginTop: '16px', color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '14px' }}
                >
                    <RefreshCw style={{ width: '16px', height: '16px', marginRight: '8px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    به‌روزرسانی داده‌ها
                </button>
                {/* CSS for spin animation needs to be global or injected, omitted here for simplicity */}
            </header>

            <main style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                
                {/* Error Message Display */}
                {error && (
                    <div style={{ gridColumn: '1 / -1', padding: '16px', backgroundColor: '#fee2e2', borderRight: '4px solid #dc2626', color: '#b91c1c', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '16px' }}>
                        <p style={{ fontWeight: 'bold' }}>خطا:</p>
                        <p>{error}</p>
                    </div>
                )}
                
                {/* 1. Expense Input Card */}
                <div style={{...cardStyle, flex: 1}}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#374151', display: 'flex', alignItems: 'center' }}>
                        <Plus style={{ width: '20px', height: '20px', marginLeft: '8px', color: '#6366f1' }} />
                        ثبت هزینه جدید
                    </h2>
                    
                    <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        <div>
                            <label htmlFor="paidBy" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>پرداخت توسط</label>
                            <select id="paidBy" name="paidBy" value={newExpense.paidBy} onChange={handleInputChange} style={inputStyle} required>
                                {PEOPLE.map(person => (<option key={person} value={person}>{person}</option>))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="amount" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>مبلغ (تومان)</label>
                            <input id="amount" name="amount" type="number" value={newExpense.amount} onChange={handleInputChange} 
                                placeholder="مثلاً 120000" style={{...inputStyle, textAlign: 'right'}} required min="1"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>توضیحات (اختیاری)</label>
                            <input id="description" name="description" type="text" value={newExpense.description} onChange={handleInputChange} 
                                placeholder="مثلاً: خرید مواد غذایی" style={inputStyle}
                            />
                        </div>
                        
                        <button type="submit" style={{ ...buttonStyle, backgroundColor: isAdding || loading ? '#818cf8' : '#4f46e5' }} disabled={isAdding || loading}>
                            <DollarSign style={{ width: '20px', height: '20px' }} />
                            <span>{isAdding ? 'در حال ثبت...' : 'ثبت هزینه'}</span>
                        </button>
                    </form>
                </div>

                
                {/* 2. Debt Summary Card */}
                <div style={{...cardStyle, flex: 1, backgroundColor: '#eef2ff'}}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#3730a3', display: 'flex', alignItems: 'center' }}>
                        <Users style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
                        خلاصه بدهی‌ها
                    </h2>
                    
                    {loading && <p style={{ textAlign: 'center', color: '#6366f1' }}>در حال محاسبه...</p>}
                    
                    {!loading && debtSummary.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#e0e7ff', borderRadius: '8px', color: '#4338ca' }}>
                            <p style={{ fontWeight: '500' }}>تسویه حساب کامل است! 🎉</p>
                            <p style={{ fontSize: '14px', marginTop: '4px' }}>هیچ بدهی برای تسویه وجود ندارد.</p>
                        </div>
                    )}
                    
                    {!loading && debtSummary.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {debtSummary.map((debt, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', border: '1px solid #c7d2fe' }}>
                                    <span style={{ color: '#4b5563', fontSize: '14px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{debt.from}</span> باید به 
                                        <span style={{ fontWeight: 'bold', color: '#10b981' }}> {debt.to}</span> بدهد:
                                    </span>
                                    <span style={{ fontWeight: '900', fontSize: '18px', color: '#4f46e5' }}>
                                        {debt.amount.toLocaleString('fa-IR')}
                                        <span style={{ fontSize: '14px', fontWeight: 'normal', marginRight: '4px' }}>تومان</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* 3. Expense List */}
                <div style={{...cardStyle, gridColumn: '1 / -1', marginTop: '32px'}}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#374151', display: 'flex', alignItems: 'center' }}>
                        <List style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
                        آخرین هزینه‌ها
                    </h2>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f9fafb' }}>
                                <tr>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                                        توضیحات
                                    </th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                                        پرداخت توسط
                                    </th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                                        مبلغ
                                    </th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' }}>
                                        تاریخ
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: 'white' }}>
                                {loading && expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: '#6366f1', borderBottom: '1px solid #f3f4f6' }}>در حال بارگذاری...</td>
                                    </tr>
                                ) : expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '16px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>هنوز هزینه‌ای ثبت نشده است.</td>
                                    </tr>
                                ) : (
                                    expenses.map((expense) => (
                                        <tr key={expense.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '16px 16px', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                                {expense.description || 'بدون توضیحات'}
                                            </td>
                                            <td style={{ padding: '16px 16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#4b5563' }}>
                                                <span style={{ fontWeight: '600', color: '#4f46e5' }}>{expense.paidBy}</span>
                                            </td>
                                            <td style={{ padding: '16px 16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#111827' }}>
                                                {expense.amount.toLocaleString('fa-IR')}
                                                <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '4px' }}>تومان</span>
                                            </td>
                                            <td style={{ padding: '16px 16px', whiteSpace: 'nowrap', fontSize: '14px', color: '#6b7280' }}>
                                                {expense.date.split('T')[0]}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
            
            <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#9ca3af', padding: '16px' }}>
                © 2025 SplitWise Clone. توسعه یافته با React و CSS خام.
            </footer>
        </div>
    );
};

export default App;