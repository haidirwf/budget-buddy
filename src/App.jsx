import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, List, BarChart3, Heart, Settings as SettingsIcon } from 'lucide-react';
import { useLocalStorage, getInitialData } from './hooks/useLocalStorage';
import { generateSampleData } from './utils/sampleData';
import { checkAchievements } from './utils/achievements';
import AddTransactionModal from './components/AddTransactionModal';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Statistics from './pages/Statistics';
import PetInfo from './pages/PetInfo';
import Settings from './pages/Settings';
import './index.css';

function App() {
  const [data, setData] = useLocalStorage('budgetbuddy_data', null);
  const [currentPage, setCurrentPage] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [darkMode, setDarkMode] = useLocalStorage('budgetbuddy_darkmode', false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [newAchievements, setNewAchievements] = useState([]);

  // Initialize data on first load
  useEffect(() => {
    if (!data) {
      const initialData = getInitialData();
      const sampleData = generateSampleData();
      setData({
        ...initialData,
        ...sampleData,
      });
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!data) return null;

  const handleAddTransaction = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSaveTransaction = (transaction) => {
    const updatedData = {
      ...data,
      transactions: [...data.transactions, transaction],
    };

    // Update pet progress
    const totalIncome = updatedData.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = updatedData.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = Math.max(0, totalIncome - totalExpense);
    const balance = totalIncome - totalExpense;

    // Determine stage
    let stage = 'egg';
    let level = 1;
    if (totalSavings >= 2000000) {
      stage = 'adult';
      level = 3;
    } else if (totalSavings >= 500000) {
      stage = 'baby';
      level = 2;
    }

    // Calculate health
    let health = 100;
    if (balance < 0) health = 40;
    else if (balance === 0) health = 70;

    updatedData.petProgress = {
      ...data.petProgress,
      totalSavings,
      health,
      stage,
      level,
      lastTransactionDate: transaction.date,
    };

    // Check for new achievements
    const unlockedAchievements = checkAchievements(updatedData);
    if (unlockedAchievements.length > 0) {
      updatedData.achievements = updatedData.achievements.map((achievement) => {
        if (unlockedAchievements.includes(achievement.id)) {
          return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return achievement;
      });
      setNewAchievements(unlockedAchievements);
    }

    setData(updatedData);
    setModalOpen(false);

    showToast('Transaction saved! 🎉');
  };

  const handleDeleteTransaction = (id) => {
    const updatedData = {
      ...data,
      transactions: data.transactions.filter((t) => t.id !== id),
    };

    // Recalculate pet progress
    const totalIncome = updatedData.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = updatedData.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = Math.max(0, totalIncome - totalExpense);
    const balance = totalIncome - totalExpense;

    let stage = 'egg';
    let level = 1;
    if (totalSavings >= 2000000) {
      stage = 'adult';
      level = 3;
    } else if (totalSavings >= 500000) {
      stage = 'baby';
      level = 2;
    }

    let health = 100;
    if (balance < 0) health = 40;
    else if (balance === 0) health = 70;

    updatedData.petProgress = {
      ...data.petProgress,
      totalSavings,
      health,
      stage,
      level,
    };

    setData(updatedData);
    showToast('Transaction deleted');
  };

  const handleUpdateProfile = (profile) => {
    setData({ ...data, profile });
  };

  const handleClearData = () => {
    const initialData = getInitialData();
    setData(initialData);
    setCurrentPage('home');
    showToast('All data cleared');
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: List, label: 'History' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'pet', icon: Heart, label: 'Pet' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 z-30 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            BudgetBuddy
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentPage === 'home' && (
              <Dashboard
                data={data}
                onAddTransaction={handleAddTransaction}
                onPetClick={() => setCurrentPage('pet')}
              />
            )}
            {currentPage === 'history' && (
              <History data={data} onDeleteTransaction={handleDeleteTransaction} />
            )}
            {currentPage === 'stats' && <Statistics data={data} />}
            {currentPage === 'pet' && <PetInfo data={data} />}
            {currentPage === 'settings' && (
              <Settings
                data={data}
                onUpdateProfile={handleUpdateProfile}
                onClearData={handleClearData}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 z-30">
        <div className="max-w-4xl mx-auto flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive
                  ? 'text-light-primary dark:text-dark-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        onSave={handleSaveTransaction}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="toast"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Unlock Popup */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-blue-600 text-white px-6 py-4 rounded-xl shadow-xl cursor-pointer"
            onClick={() => setNewAchievements([])}
          >
            <div className="flex flex-col items-center text-center">
              <p className="text-lg font-bold">Achievement Unlocked!</p>
              <p className="text-sm opacity-80">Tap to dismiss</p>
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
