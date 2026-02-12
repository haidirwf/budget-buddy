import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Heart } from 'lucide-react';
import Pet from '../components/Pet';

const Dashboard = ({ data, onAddTransaction, onPetClick }) => {
    const [petAnimation, setPetAnimation] = useState('idle');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Calculate balance
    const balance = data.transactions.reduce((sum, t) => {
        return t.type === 'income' ? sum + t.amount : sum - t.amount;
    }, 0);

    // Determine pet mood
    const getPetMood = () => {
        if (balance > 0) return 'happy';
        if (balance < 0) return 'sad';
        return 'neutral';
    };

    // Trigger pet animation on balance change
    useEffect(() => {
        if (data.transactions.length > 0) {
            const lastTransaction = data.transactions[data.transactions.length - 1];
            if (lastTransaction.type === 'income') {
                setPetAnimation('happy');
            } else {
                setPetAnimation('sad');
            }
            setTimeout(() => setPetAnimation('idle'), 1000);
        }
    }, [data.transactions.length]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getLeftToNextLevel = () => {
        if (data.petProgress.stage === 'egg') {
            return Math.max(0, 500000 - data.petProgress.totalSavings);
        } else if (data.petProgress.stage === 'baby') {
            return Math.max(0, 2000000 - data.petProgress.totalSavings);
        }
        return 0;
    };

    return (
        <div className="min-h-screen pb-24 px-4 pt-6 max-w-4xl mx-auto">
            {/* Pet Display */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-8"
            >
                <Pet
                    stage={data.petProgress.stage}
                    mood={getPetMood()}
                    animate={petAnimation}
                    onClick={onPetClick}
                />

                {/* Pet Health Bar */}
                <div className="w-full max-w-xs mt-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{data.profile.petName}</span>
                        <span className="text-gray-500">Health: {data.petProgress.health}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${data.petProgress.health}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${
                                data.petProgress.health > 70
                                    ? 'bg-green-500'
                                    : data.petProgress.health > 40
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                            }`}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="card mb-6"
            >
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Balance</p>
                    <motion.h2
                        key={balance}
                        initial={{ scale: 1.2, color: '#3b82f6' }}
                        animate={{ scale: 1, color: balance >= 0 ? '#10b981' : '#ef4444' }}
                        transition={{ duration: 0.3 }}
                        className={`text-4xl font-bold ${balance >= 0 ? 'text-light-success dark:text-dark-success' : 'text-light-danger dark:text-dark-danger'
                            }`}
                    >
                        {formatCurrency(balance)}
                    </motion.h2>

                    {/* Pet Stage Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex justify-around text-sm mb-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Stage</p>
                                <p className="font-semibold capitalize">{data.petProgress.stage}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Level</p>
                                <p className="font-semibold">{data.petProgress.level}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Streak</p>
                                <p className="font-semibold">{data.petProgress.daysStreak} days</p>
                            </div>
                        </div>

                        {/* Next Level Progress */}
                        {data.petProgress.level < 3 && (
                            <div className="bg-light-primary/10 dark:bg-dark-primary/10 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-semibold text-light-primary dark:text-dark-primary">
                                        Left till next level:
                                    </p>
                                    <p className="text-sm font-bold text-light-primary dark:text-dark-primary">
                                        {formatCurrency(getLeftToNextLevel())}
                                    </p>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(
                                                100,
                                                (data.petProgress.totalSavings / (data.petProgress.stage === 'egg' ? 500000 : 2000000)) * 100
                                            )}%`,
                                        }}
                                        className="h-full bg-light-primary dark:bg-dark-primary rounded-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
            >
                <button
                    onClick={() => onAddTransaction('income')}
                    className="btn btn-success flex items-center justify-center gap-2 py-6 text-lg"
                >
                    <TrendingUp size={24} />
                    <span>+ Income</span>
                </button>
                <button
                    onClick={() => onAddTransaction('expense')}
                    className="btn btn-danger flex items-center justify-center gap-2 py-6 text-lg"
                >
                    <TrendingDown size={24} />
                    <span>- Expense</span>
                </button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6 md:max-w-sm md:mx-auto"
            >
                <div className="card">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Savings</p>
                    <p className="text-xl font-bold text-light-primary dark:text-dark-primary">
                        {formatCurrency(data.petProgress.totalSavings)}
                    </p>
                </div>
                <div className="card">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transactions</p>
                    <p className="text-xl font-bold text-light-primary dark:text-dark-primary">
                        {data.transactions.length}
                    </p>
                </div>
            </motion.div>

            {/* Toast Notification */}
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="toast"
                >
                    {toastMessage}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
