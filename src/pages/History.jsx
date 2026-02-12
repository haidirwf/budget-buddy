import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Filter } from 'lucide-react';
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

const categoryIcons = {
    food: '🍔',
    transportation: '🚗',
    shopping: '🛍️',
    entertainment: '🎮',
    education: '📚',
    health: '💊',
    bills: '💡',
    other: '📦',
};

const History = ({ data, onDeleteTransaction }) => {
    const [dateFilter, setDateFilter] = useState('all'); // today, 7days, 30days, all
    const [categoryFilter, setCategoryFilter] = useState('all');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Filter transactions
    const filteredTransactions = data.transactions.filter((t) => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));

        let dateMatch = true;
        if (dateFilter === 'today') dateMatch = daysDiff === 0;
        if (dateFilter === '7days') dateMatch = daysDiff <= 7;
        if (dateFilter === '30days') dateMatch = daysDiff <= 30;

        const categoryMatch = categoryFilter === 'all' || t.category === categoryFilter;

        return dateMatch && categoryMatch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by date
    const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
        const date = startOfDay(new Date(transaction.date)).toISOString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(transaction);
        return groups;
    }, {});

    // Calculate totals
    const totalIncome = filteredTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;

    const getDateLabel = (dateStr) => {
        const date = new Date(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMM dd, yyyy');
    };

    return (
        <div className="min-h-screen pb-24 px-4 pt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Income</p>
                    <p className="text-sm font-bold text-light-success dark:text-dark-success">
                        {formatCurrency(totalIncome)}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="card p-4"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expense</p>
                    <p className="text-sm font-bold text-light-danger dark:text-dark-danger">
                        {formatCurrency(totalExpense)}
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-4"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net</p>
                    <p className={`text-sm font-bold ${netBalance >= 0 ? 'text-light-primary dark:text-dark-primary' : 'text-light-danger dark:text-dark-danger'}`}>
                        {formatCurrency(netBalance)}
                    </p>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                <div className="flex gap-2 flex-shrink-0">
                    {['all', 'today', '7days', '30days'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setDateFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dateFilter === filter
                                    ? 'bg-light-primary dark:bg-dark-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {filter === 'all' ? 'All' : filter === 'today' ? 'Today' : filter === '7days' ? '7 Days' : '30 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-6">
                {Object.keys(groupedTransactions).length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg">No transactions found</p>
                        <p className="text-sm mt-2">Try adjusting your filters</p>
                    </div>
                ) : (
                    Object.keys(groupedTransactions)
                        .sort((a, b) => new Date(b) - new Date(a))
                        .map((dateKey, groupIndex) => (
                            <motion.div
                                key={dateKey}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: groupIndex * 0.05 }}
                            >
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                                    {getDateLabel(dateKey)}
                                </h3>
                                <div className="space-y-2">
                                    {groupedTransactions[dateKey].map((transaction, index) => (
                                        <motion.div
                                            key={transaction.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="card flex items-center justify-between p-4 hover:shadow-xl transition-shadow"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="text-3xl">{categoryIcons[transaction.category]}</div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{transaction.note}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {format(new Date(transaction.date), 'HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p
                                                    className={`text-lg font-bold ${transaction.type === 'income'
                                                            ? 'text-light-success dark:text-dark-success'
                                                            : 'text-light-danger dark:text-dark-danger'
                                                        }`}
                                                >
                                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this transaction?')) {
                                                            onDeleteTransaction(transaction.id);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-light-danger dark:text-dark-danger"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                )}
            </div>
        </div>
    );
};

export default History;
