import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, DollarSign, Moon, Sun, Trash2 } from 'lucide-react';

const Settings = ({ data, onUpdateProfile, onClearData, darkMode, onToggleDarkMode }) => {
    const [name, setName] = useState(data.profile.name);
    const [petName, setPetName] = useState(data.profile.petName);
    const [monthlyBudget, setMonthlyBudget] = useState(data.profile.monthlyBudget);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        onUpdateProfile({
            ...data.profile,
            name,
            petName,
            monthlyBudget: parseInt(monthlyBudget),
        });

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const handleClearData = () => {
        if (confirm('⚠️ This will delete ALL your data including transactions, pet progress, and achievements. Are you sure?')) {
            if (confirm('This action cannot be undone. Continue?')) {
                onClearData();
            }
        }
    };

    return (
        <div className="min-h-screen pb-24 px-4 pt-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            {/* Profile Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card mb-6"
            >
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <User size={20} />
                    Profile
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Heart size={16} />
                            Pet Name
                        </label>
                        <input
                            type="text"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            className="w-full p-3 rounded-xl"
                            placeholder="Enter pet name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <DollarSign size={16} />
                            Monthly Budget (IDR)
                        </label>
                        <input
                            type="number"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(e.target.value)}
                            className="w-full p-3 rounded-xl"
                            placeholder="2000000"
                            step="100000"
                        />
                    </div>

                    <button onClick={handleSave} className="btn btn-primary w-full">
                        {showSuccess ? '✓ Saved!' : 'Save Changes'}
                    </button>
                </div>
            </motion.div>

            {/* Appearance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card mb-6"
            >
                <h2 className="text-lg font-bold mb-4">Appearance</h2>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {darkMode ? 'Enabled' : 'Disabled'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggleDarkMode}
                        className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-light-primary dark:bg-dark-primary' : 'bg-gray-300'
                            }`}
                    >
                        <motion.div
                            animate={{ x: darkMode ? 26 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                        />
                    </button>
                </div>
            </motion.div>

            {/* Currency */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card mb-6"
            >
                <h2 className="text-lg font-bold mb-4">Currency</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Currently using: <span className="font-semibold">IDR (Indonesian Rupiah)</span>
                </p>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card border-2 border-light-danger dark:border-dark-danger"
            >
                <h2 className="text-lg font-bold mb-4 text-light-danger dark:text-dark-danger flex items-center gap-2">
                    <Trash2 size={20} />
                    Danger Zone
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Clear all data including transactions, pet progress, and achievements. This action cannot be undone.
                </p>

                <button onClick={handleClearData} className="btn btn-danger w-full">
                    Clear All Data
                </button>
            </motion.div>

            {/* About */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
                <p className="mb-2">BudgetBuddy v1.0</p>
                <p>Made with 💙 for students</p>
            </motion.div>
        </div>
    );
};

export default Settings;
