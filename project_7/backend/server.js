const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS configuration to allow frontend requests
// IMPORTANT: Replace this URL with the Public URL of your Codespace's 5173 port.
const corsOptions = {
    origin: 'https://glowing-trout-pjwrx4p65576crwq7-5173.app.github.dev', // Frontend Port 5173 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
};
app.use(cors(corsOptions)); 

app.use(express.json());

// In-memory data store
let expenses = []; 
const balances = { 'علی': 0, 'سارا': 0, 'مجتبی': 0 }; 
const PEOPLE = Object.keys(balances);

const calculateDebtSummary = () => {
    // Reset balances for recalculation
    PEOPLE.forEach(person => balances[person] = 0);

    // 1. Calculate net balances
    expenses.forEach(expense => {
        const costPerPerson = expense.amount / PEOPLE.length;
        
        // The person who paid is credited the full amount
        balances[expense.paidBy] += expense.amount;

        // Everyone (including the payer) is debited their share
        PEOPLE.forEach(person => {
            balances[person] -= costPerPerson;
        });
    });

    const debtSummary = [];
    // Convert balances to array, filter near-zero values, and sort (debtor to creditor)
    const balancesArray = Object.entries(balances)
        .filter(([, balance]) => Math.abs(balance) > 0.01) 
        .sort(([, a], [, b]) => a - b); 

    let low = 0; // Pointer to the debtor (negative balance)
    let high = balancesArray.length - 1; // Pointer to the creditor (positive balance)

    // 2. Simple Settlement Algorithm
    while (low < high) {
        const [debtor, debt] = balancesArray[low]; 
        const [creditor, credit] = balancesArray[high]; 

        // The amount to settle is the minimum of the debt or credit
        const settlementAmount = Math.min(Math.abs(debt), credit);

        if (settlementAmount > 0.01) {
            debtSummary.push({
                from: debtor, 
                to: creditor, 
                amount: Math.round(settlementAmount) 
            });
        }

        // Update balances
        balancesArray[low][1] += settlementAmount;
        balancesArray[high][1] -= settlementAmount;

        // Move pointers if a person's balance is settled
        if (balancesArray[low][1] >= -0.01) { low++; }
        if (balancesArray[high][1] <= 0.01) { high--; }
    }

    return debtSummary;
};

// POST /api/expense: Add a new expense
app.post('/api/expense', (req, res) => {
    const { paidBy, amount, description } = req.body;
    
    if (!paidBy || !amount || typeof amount !== 'number') {
        return res.status(400).send({ message: 'Missing required fields: paidBy or amount' });
    }

    const newExpense = {
        id: Date.now(),
        paidBy,
        amount,
        description: description || '',
        date: new Date().toISOString()
    };
    
    expenses.push(newExpense);

    res.status(201).send(newExpense);
});

// GET /api/expenses: Get all expenses (newest first)
app.get('/api/expenses', (req, res) => {
    res.json(expenses.slice().reverse()); 
});

// GET /api/debt: Get the simplified debt summary
app.get('/api/debt', (req, res) => {
    const summary = calculateDebtSummary();
    res.json(summary);
});

app.listen(PORT, () => {
    console.log(`SplitWise Backend Mock Server running on port ${PORT}`);
});