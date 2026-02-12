import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Calendar, DollarSign, Check, Trash2 } from 'lucide-react';

const categories = [
    { id: 'food', name: 'Food & Drink', icon: '🍔' },
    { id: 'transportation', name: 'Transportation', icon: '🚗' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'health', name: 'Health', icon: '💊' },
    { id: 'bills', name: 'Bills', icon: '💡' },
    { id: 'other', name: 'Other', icon: '📦' },
];

const AddTransactionModal = ({ isOpen, onClose, type = 'expense', onSave }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        const transaction = {
            id: `txn_${Date.now()}`,
            type,
            amount: parseFloat(amount),
            category,
            note: note || 'No description',
            date: new Date(date).toISOString(),
        };

        onSave(transaction);
        handleClose();
    };

    const handleClose = () => {
        // Reset form saat tutup
        setAmount('');
        setCategory('food');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] md:w-full md:max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl z-50 overflow-hidden flex flex-col border-2 border-gray-200 dark:border-gray-800"
                    >
                        {/* Header */}
                        <div className="p-6 pb-0 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                <span className={type === 'income' ? 'text-green-500' : 'text-red-500'}>
                                    {type === 'income' ? '+ Tambah Pemasukan' : '- Tambah Pengeluaran'}
                                </span>
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Body (Scrollable) */}
                        <form id="transaction-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Amount Input */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                                    <DollarSign size={14} /> Nominal (IDR)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full text-4xl font-black bg-transparent border-b-2 border-gray-100 dark:border-gray-800 focus:border-blue-500 outline-none py-2 transition-all"
                                    autoFocus
                                    required
                                />
                            </div>

                            {/* Category Grid */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                                    <Tag size={14} /> Kategori
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${category === cat.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                                : 'border-transparent bg-gray-50 dark:bg-gray-800/50 opacity-60'
                                                }`}
                                        >
                                            <span className="text-2xl mb-1">{cat.icon}</span>
                                            <span className="text-[10px] font-bold truncate w-full text-center">{cat.name.split(' ')[0]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs Row (Note & Date) */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Catatan</label>
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Beli apa?"
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block flex items-center gap-2">
                                        <Calendar size={14} /> Tanggal
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Footer Action Buttons */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex gap-3 border-t border-gray-200 dark:border-gray-800">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all active:scale-95 border border-gray-300 dark:border-gray-700"
                            >
                                <X size={18} />
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="transaction-form"
                                className={`flex-[2] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white transition-all active:scale-95 border border-transparent hover:opacity-90 ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                <Check size={18} />
                                Simpan Oke
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddTransactionModal;