import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';

const categoryColors = {
    food: '#f59e0b',
    transportation: '#3b82f6',
    shopping: '#ec4899',
    entertainment: '#8b5cf6',
    education: '#10b981',
    health: '#ef4444',
    bills: '#6366f1',
    other: '#6b7280',
    salary: '#059669',
    freelance: '#7c3aed',
    bonus: '#db2777',
    gift: '#f97316',
    allowance: '#0891b2',
    investment: '#16a34a',
    parttime: '#ea580c',
    other_income: '#6b7280',
};

const Statistics = ({ data }) => {
    const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Filter by time range
    const getDaysAgo = () => {
        if (timeRange === '7d') return 7;
        if (timeRange === '30d') return 30;
        return 90;
    };

    const filterByDays = (transactions, days) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return transactions.filter((t) => new Date(t.date) >= cutoffDate);
    };

    const filteredTransactions = filterByDays(data.transactions, getDaysAgo());

    // Spending by category (Pie Chart)
    const expensesByCategory = filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const pieData = Object.keys(expensesByCategory).map((category) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: expensesByCategory[category],
        color: categoryColors[category],
    }));

    // Balance over time (Line Chart)
    const balanceOverTime = [];
    let runningBalance = 0;

    const sortedTransactions = [...data.transactions]
        .filter((t) => new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const dateMap = {};
    sortedTransactions.forEach((t) => {
        const dateKey = format(new Date(t.date), 'MMM dd');
        if (!dateMap[dateKey]) {
            dateMap[dateKey] = 0;
        }
        dateMap[dateKey] += t.type === 'income' ? t.amount : -t.amount;
    });

    Object.keys(dateMap).forEach((date) => {
        runningBalance += dateMap[date];
        balanceOverTime.push({
            date,
            balance: runningBalance,
        });
    });

    // Quick stats
    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    const monthTransactions = data.transactions.filter((t) => new Date(t.date) >= monthStart);

    const monthIncome = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthExpense = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savedThisMonth = monthIncome - monthExpense;

    const biggestExpense = Math.max(
        ...(data.transactions.filter((t) => t.type === 'expense').map((t) => t.amount)),
        0
    );

    const totalIncome = data.transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = data.transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return (
        <div className="min-h-screen pb-24 px-4 pt-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Statistics</h1>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saved</p>
                    <p className="text-sm font-bold text-light-success dark:text-dark-success">
                        {formatCurrency(savedThisMonth)}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="card p-4"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Biggest</p>
                    <p className="text-sm font-bold text-light-danger dark:text-dark-danger">
                        {formatCurrency(biggestExpense)}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-4"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saving</p>
                    <p className="text-sm font-bold text-light-primary dark:text-dark-primary">
                        {savingRate.toFixed(0)}%
                    </p>
                </motion.div>
            </div>

            {/* Time Range Filter */}
            <div className="flex gap-2 mb-6">
                {['7d', '30d', '90d'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${timeRange === range
                                ? 'bg-light-primary dark:bg-dark-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                    </button>
                ))}
            </div>

            {/* Spending by Category */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card mb-6"
            >
                <h2 className="text-lg font-bold mb-4">Spending by Category</h2>
                {pieData.length > 0 ? (
                    <>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {pieData.map((entry) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-sm">{entry.name}: {formatCurrency(entry.value)}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No expenses in this period</p>
                )}
            </motion.div>

            {/* Balance Over Time */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
            >
                <h2 className="text-lg font-bold mb-4">Balance Over Time (30 Days)</h2>
                {balanceOverTime.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={balanceOverTime}>
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            />
                            <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No data available</p>
                )}
            </motion.div>
        </div>
    );
};

export default Statistics;
