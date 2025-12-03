// Budget Calculator Module
import { saveToLocalStorage, getFromLocalStorage } from './modules/dataService.js';

// DOM Elements
let expenseCounter = 1;
let budgets = [];

// Initialize Calculator
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calculator')) {
        initCalculator();
        loadSavedBudgets();
        initChart();
    }
});

// Initialize Calculator Functionality
function initCalculator() {
    // Add first expense input
    addExpenseInput();
    
    // Event Listeners
    document.getElementById('addExpense').addEventListener('click', addExpenseInput);
    document.getElementById('calculateBudget').addEventListener('click', calculateBudget);
    document.getElementById('saveBudget').addEventListener('click', saveBudget);
    
    // Load sample data if no saved data
    if (!getFromLocalStorage('budgets')) {
        loadSampleBudget();
    }
}

// Add Expense Input Field
function addExpenseInput() {
    const container = document.getElementById('expenseInputs');
    const expenseId = `expense-${expenseCounter}`;
    
    const expenseDiv = document.createElement('div');
    expenseDiv.className = 'expense-item';
    expenseDiv.innerHTML = `
        <input type="text" class="expense-name" placeholder="Expense Name" 
               value="${getDefaultExpenseName(expenseCounter)}">
        <input type="number" class="expense-amount" placeholder="Amount ($)" min="0" value="0">
        <button type="button" class="remove-expense" data-id="${expenseId}">&times;</button>
    `;
    
    container.appendChild(expenseDiv);
    expenseCounter++;
    
    // Add remove event listener
    expenseDiv.querySelector('.remove-expense').addEventListener('click', function() {
        if (document.querySelectorAll('.expense-item').length > 1) {
            this.parentElement.remove();
            updateExpenseNumbers();
        }
    });
}

// Get Default Expense Name
function getDefaultExpenseName(index) {
    const defaultExpenses = [
        'Rent/Mortgage',
        'Utilities',
        'Groceries',
        'Transportation',
        'Entertainment',
        'Healthcare',
        'Insurance',
        'Debt Payment',
        'Savings',
        'Miscellaneous'
    ];
    
    return defaultExpenses[index - 1] || `Expense ${index}`;
}

// Update Expense Numbers after removal
function updateExpenseNumbers() {
    const expenses = document.querySelectorAll('.expense-item');
    expenses.forEach((expense, index) => {
        const nameInput = expense.querySelector('.expense-name');
        const defaultName = getDefaultExpenseName(index + 1);
        if (nameInput.value === getDefaultExpenseName(index + 2)) {
            nameInput.value = defaultName;
        }
    });
}

// Calculate Budget
function calculateBudget() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const expenses = getExpenses();
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = income - totalExpenses;
    const savingsRate = income > 0 ? (remaining / income * 100).toFixed(1) : 0;
    
    // Display Results
    displayResults(income, expenses, totalExpenses, remaining, savingsRate);
    
    // Update Chart
    updateChart(income, expenses, remaining);
    
    // Generate Tips
    generateBudgetTips(income, expenses, remaining, savingsRate);
}

// Get Expenses from Inputs
function getExpenses() {
    const expenses = [];
    const expenseItems = document.querySelectorAll('.expense-item');
    
    expenseItems.forEach(item => {
        const name = item.querySelector('.expense-name').value || 'Unnamed Expense';
        const amount = parseFloat(item.querySelector('.expense-amount').value) || 0;
        
        if (amount > 0) {
            expenses.push({ name, amount });
        }
    });
    
    return expenses;
}

// Display Results
function displayResults(income, expenses, totalExpenses, remaining, savingsRate) {
    const resultsDiv = document.getElementById('resultsDisplay');
    const isPositive = remaining >= 0;
    
    resultsDiv.innerHTML = `
        <div class="results-item ${isPositive ? 'positive' : 'negative'}">
            <span>Monthly Income:</span>
            <strong>$${income.toFixed(2)}</strong>
        </div>
        <div class="results-item">
            <span>Total Expenses:</span>
            <strong>$${totalExpenses.toFixed(2)}</strong>
        </div>
        <div class="results-item ${isPositive ? 'positive' : 'negative'}">
            <span>Remaining Balance:</span>
            <strong>$${remaining.toFixed(2)}</strong>
        </div>
        <div class="results-item">
            <span>Savings Rate:</span>
            <strong>${savingsRate}%</strong>
        </div>
        <div class="budget-breakdown">
            <h4>Expense Breakdown</h4>
            ${expenses.map(expense => `
                <div class="budget-category">
                    <div class="category-header">
                        <span>${expense.name}</span>
                        <span>$${expense.amount.toFixed(2)} (${(expense.amount/income*100).toFixed(1)}%)</span>
                    </div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${expense.amount/income*100}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Save Budget
function saveBudget() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    const expenses = getExpenses();
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = income - totalExpenses;
    
    const budget = {
        id: Date.now(),
        date: new Date().toISOString(),
        income,
        expenses,
        totalExpenses,
        remaining,
        savingsRate: income > 0 ? (remaining / income * 100).toFixed(1) : 0
    };
    
    // Save to budgets array
    budgets.push(budget);
    
    // Save to localStorage
    saveToLocalStorage('budgets', budgets);
    
    // Update display
    loadSavedBudgets();
    
    // Show success message
    showMessage('Budget saved successfully!', 'success');
}

// Load Saved Budgets
function loadSavedBudgets() {
    budgets = getFromLocalStorage('budgets') || [];
    const container = document.getElementById('savedBudgetsList');
    
    if (budgets.length === 0) {
        container.innerHTML = '<p class="no-budgets">No saved budgets yet. Create and save your first budget!</p>';
        return;
    }
    
    // Sort by most recent
    budgets.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = budgets.map(budget => `
        <div class="saved-budget" data-id="${budget.id}">
            <div class="budget-summary">
                <h4>Budget from ${new Date(budget.date).toLocaleDateString()}</h4>
                <p>Income: $${budget.income.toFixed(2)} | Expenses: $${budget.totalExpenses.toFixed(2)}</p>
                <p class="${budget.remaining >= 0 ? 'positive' : 'negative'}">
                    Balance: $${budget.remaining.toFixed(2)} (${budget.savingsRate}%)
                </p>
            </div>
            <div class="budget-actions">
                <button class="btn-secondary load-budget" data-id="${budget.id}">Load</button>
                <button class="delete-budget" data-id="${budget.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.load-budget').forEach(btn => {
        btn.addEventListener('click', function() {
            const budgetId = parseInt(this.dataset.id);
            loadBudget(budgetId);
        });
    });
    
    document.querySelectorAll('.delete-budget').forEach(btn => {
        btn.addEventListener('click', function() {
            const budgetId = parseInt(this.dataset.id);
            deleteBudget(budgetId);
        });
    });
}

// Load Specific Budget
function loadBudget(budgetId) {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;
    
    // Set income
    document.getElementById('income').value = budget.income;
    
    // Clear existing expenses
    const expenseContainer = document.getElementById('expenseInputs');
    expenseContainer.innerHTML = '';
    expenseCounter = 1;
    
    // Add budget expenses
    budget.expenses.forEach((expense, index) => {
        addExpenseInput();
        const lastExpense = expenseContainer.lastElementChild;
        lastExpense.querySelector('.expense-name').value = expense.name;
        lastExpense.querySelector('.expense-amount').value = expense.amount;
    });
    
    // Recalculate
    calculateBudget();
    
    showMessage('Budget loaded successfully!', 'success');
}

// Delete Budget
function deleteBudget(budgetId) {
    if (confirm('Are you sure you want to delete this budget?')) {
        budgets = budgets.filter(b => b.id !== budgetId);
        saveToLocalStorage('budgets', budgets);
        loadSavedBudgets();
        showMessage('Budget deleted successfully!', 'success');
    }
}

// Load Sample Budget
function loadSampleBudget() {
    const sampleBudget = {
        id: 1,
        date: new Date().toISOString(),
        income: 3000,
        expenses: [
            { name: 'Rent', amount: 1000 },
            { name: 'Groceries', amount: 300 },
            { name: 'Utilities', amount: 150 },
            { name: 'Transportation', amount: 200 },
            { name: 'Entertainment', amount: 150 },
            { name: 'Savings', amount: 300 }
        ],
        totalExpenses: 2100,
        remaining: 900,
        savingsRate: 30
    };
    
    budgets.push(sampleBudget);
    saveToLocalStorage('budgets', [sampleBudget]);
}

// Chart.js Initialization
let budgetChart = null;

function initChart() {
    const ctx = document.getElementById('budgetChart')?.getContext('2d');
    if (!ctx) return;
    
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Expenses', 'Remaining'],
            datasets: [{
                data: [0, 100],
                backgroundColor: [
                    '#e74c3c',
                    '#2ecc71'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed}`;
                        }
                    }
                }
            }
        }
    });
}

// Update Chart
function updateChart(income, expenses, remaining) {
    if (!budgetChart) return;
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    budgetChart.data.datasets[0].data = [totalExpenses, remaining];
    
    // Update labels with percentages
    const expensePercent = income > 0 ? (totalExpenses / income * 100).toFixed(1) : 0;
    const remainingPercent = income > 0 ? (remaining / income * 100).toFixed(1) : 0;
    
    budgetChart.data.labels = [
        `Expenses (${expensePercent}%)`,
        `Remaining (${remainingPercent}%)`
    ];
    
    // Add expense breakdown if we have space
    if (expenses.length <= 8) {
        const expenseLabels = expenses.map(e => e.name);
        const expenseData = expenses.map(e => e.amount);
        
        // Create or update detailed chart
        updateDetailedChart(expenseLabels, expenseData);
    }
    
    budgetChart.update();
}

// Detailed Chart for Expenses
function updateDetailedChart(labels, data) {
    const detailedCtx = document.getElementById('detailedChart')?.getContext('2d');
    if (!detailedCtx) {
        // Create canvas if it doesn't exist
        const resultsDiv = document.getElementById('resultsDisplay');
        const existingCanvas = resultsDiv.querySelector('#detailedChart');
        if (existingCanvas) existingCanvas.remove();
        
        const canvas = document.createElement('canvas');
        canvas.id = 'detailedChart';
        canvas.width = 400;
        canvas.height = 300;
        resultsDiv.appendChild(canvas);
        
        new Chart(canvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
                        '#9b59b6', '#1abc9c', '#d35400', '#34495e'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
}

// Generate Budget Tips
function generateBudgetTips(income, expenses, remaining, savingsRate) {
    const tipsContainer = document.getElementById('dynamicTips');
    if (!tipsContainer) return;
    
    const tips = [];
    
    // Analyze budget and generate tips
    if (savingsRate < 20) {
        tips.push({
            title: "Increase Your Savings Rate",
            content: `Your current savings rate is ${savingsRate}%. Aim for at least 20% to build financial security.`,
            priority: "high"
        });
    }
    
    if (remaining < 0) {
        tips.push({
            title: "Budget Deficit Alert",
            content: "You're spending more than you earn. Review your expenses and identify areas to cut back.",
            priority: "critical"
        });
    }
    
    const highExpense = expenses.find(e => e.amount > income * 0.3);
    if (highExpense) {
        tips.push({
            title: "High Expense Detected",
            content: `${highExpense.name} is taking ${(highExpense.amount/income*100).toFixed(1)}% of your income. Consider if this can be reduced.`,
            priority: "medium"
        });
    }
    
    const wants = expenses.filter(e => 
        ['Entertainment', 'Dining', 'Shopping'].some(keyword => 
            e.name.toLowerCase().includes(keyword.toLowerCase()))
    );
    const wantsTotal = wants.reduce((sum, e) => sum + e.amount, 0);
    
    if (wantsTotal > income * 0.3) {
        tips.push({
            title: "High Discretionary Spending",
            content: `You're spending $${wantsTotal.toFixed(2)} on wants (${(wantsTotal/income*100).toFixed(1)}% of income). Consider reallocating some to savings.`,
            priority: "medium"
        });
    }
    
    // Add general tips if not enough specific ones
    if (tips.length < 3) {
        tips.push({
            title: "Emergency Fund Priority",
            content: "Make sure you're contributing to an emergency fund with 3-6 months of expenses.",
            priority: "medium"
        }, {
            title: "Review Subscriptions",
            content: "Regularly review subscription services and cancel any you don't use frequently.",
            priority: "low"
        }, {
            title: "Automate Savings",
            content: "Set up automatic transfers to savings on payday to make saving effortless.",
            priority: "low"
        });
    }
    
    // Display tips
    tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-item tip-${tip.priority}">
            <h4>${tip.title}</h4>
            <p>${tip.content}</p>
        </div>
    `).join('');
}

// Show Message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border-radius: 4px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Export for module use
export { calculateBudget, saveBudget, loadSavedBudgets };