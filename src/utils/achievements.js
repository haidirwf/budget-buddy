export const achievementDefinitions = {
    first_step: {
        id: 'first_step',
        title: 'First Step',
        description: 'Add your first transaction',
        icon: '🎯',
    },
    weekly_warrior: {
        id: 'weekly_warrior',
        title: 'Weekly Warrior',
        description: 'Track expenses for 7 days in a row',
        icon: '⚡',
    },
    budget_master: {
        id: 'budget_master',
        title: 'Budget Master',
        description: 'Track expenses for 30 days in a row',
        icon: '👑',
    },
    save_hero: {
        id: 'save_hero',
        title: 'Save Hero',
        description: 'Save 100,000 IDR in a month',
        icon: '💎',
    },
    spending_control: {
        id: 'spending_control',
        title: 'Spending Control',
        description: 'Spend less than 70% of your income',
        icon: '🎮',
    },
    rich_kid: {
        id: 'rich_kid',
        title: 'Rich Kid',
        description: 'Reach 1,000,000 IDR balance',
        icon: '💰',
    },
    millionaire: {
        id: 'millionaire',
        title: 'Millionaire',
        description: 'Save 2,000,000 IDR total',
        icon: '🏆',
    },
    consistent: {
        id: 'consistent',
        title: 'Consistent',
        description: 'Track expenses for 60 days in a row',
        icon: '🔥',
    },
};

export const checkAchievements = (data) => {
    const { transactions, petProgress, achievements } = data;
    const newUnlocks = [];

    // First Step
    if (transactions.length >= 1 && !achievements.find(a => a.id === 'first_step')?.unlocked) {
        newUnlocks.push('first_step');
    }

    // Weekly Warrior
    if (petProgress.daysStreak >= 7 && !achievements.find(a => a.id === 'weekly_warrior')?.unlocked) {
        newUnlocks.push('weekly_warrior');
    }

    // Budget Master
    if (petProgress.daysStreak >= 30 && !achievements.find(a => a.id === 'budget_master')?.unlocked) {
        newUnlocks.push('budget_master');
    }

    // Consistent
    if (petProgress.daysStreak >= 60 && !achievements.find(a => a.id === 'consistent')?.unlocked) {
        newUnlocks.push('consistent');
    }

    // Save Hero - 100k in a month
    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
    const monthTransactions = transactions.filter(t => new Date(t.date) >= monthStart);
    const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const monthSavings = monthIncome - monthExpense;

    if (monthSavings >= 100000 && !achievements.find(a => a.id === 'save_hero')?.unlocked) {
        newUnlocks.push('save_hero');
    }

    // Spending Control
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    if (totalIncome > 0 && (totalExpense / totalIncome) < 0.7 && !achievements.find(a => a.id === 'spending_control')?.unlocked) {
        newUnlocks.push('spending_control');
    }

    // Rich Kid
    const balance = totalIncome - totalExpense;
    if (balance >= 1000000 && !achievements.find(a => a.id === 'rich_kid')?.unlocked) {
        newUnlocks.push('rich_kid');
    }

    // Millionaire
    if (petProgress.totalSavings >= 2000000 && !achievements.find(a => a.id === 'millionaire')?.unlocked) {
        newUnlocks.push('millionaire');
    }

    return newUnlocks;
};

export const calculateProgress = (achievementId, data) => {
    const { transactions, petProgress } = data;

    switch (achievementId) {
        case 'first_step':
            return Math.min(100, (transactions.length / 1) * 100);
        case 'weekly_warrior':
            return Math.min(100, (petProgress.daysStreak / 7) * 100);
        case 'budget_master':
            return Math.min(100, (petProgress.daysStreak / 30) * 100);
        case 'consistent':
            return Math.min(100, (petProgress.daysStreak / 60) * 100);
        case 'save_hero':
            const thisMonth = new Date();
            const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
            const monthTransactions = transactions.filter(t => new Date(t.date) >= monthStart);
            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const monthSavings = monthIncome - monthExpense;
            return Math.min(100, (monthSavings / 100000) * 100);
        case 'spending_control':
            const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            if (totalIncome === 0) return 0;
            const spendingRate = totalExpense / totalIncome;
            return spendingRate <= 0.7 ? 100 : Math.max(0, 100 - ((spendingRate - 0.7) * 500));
        case 'rich_kid':
            const balance = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            return Math.min(100, (balance / 1000000) * 100);
        case 'millionaire':
            return Math.min(100, (petProgress.totalSavings / 2000000) * 100);
        default:
            return 0;
    }
};
