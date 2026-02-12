export const generateSampleData = () => {
    const expenseCategories = ['food', 'transportation', 'shopping', 'entertainment', 'education', 'health', 'bills', 'other'];
    const incomeCategories = ['salary', 'freelance', 'bonus', 'gift', 'allowance', 'investment', 'parttime', 'other_income'];
    const transactions = [];

    const today = new Date();
    let balance = 0;

    // Generate 30 days of transactions
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Add 1-3 transactions per day
        const numTransactions = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < numTransactions; j++) {
            const isIncome = Math.random() < 0.3; // 30% chance of income

            let amount, category, note;

            if (isIncome) {
                amount = [500000, 1500000, 2000000, 750000][Math.floor(Math.random() * 4)];
                category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
                const incomeNotes = {
                    salary: ['Monthly Salary', 'Salary Payment'],
                    freelance: ['Freelance Project', 'Freelance Work'],
                    bonus: ['Monthly Bonus', 'Performance Bonus'],
                    gift: ['Gift Money', 'Money Gift'],
                    allowance: ['Allowance', 'Weekly Allowance'],
                    investment: ['Investment Return', 'Dividend'],
                    parttime: ['Part-time Work', 'Part-time Job'],
                    other_income: ['Income', 'Other Income']
                };
                note = incomeNotes[category][Math.floor(Math.random() * incomeNotes[category].length)];
            } else {
                amount = Math.floor(Math.random() * 150000) + 15000;
                category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

                const notes = {
                    food: ['Lunch', 'Dinner with friends', 'Coffee', 'Breakfast', 'Snacks'],
                    transportation: ['Bus fare', 'Grab', 'Fuel', 'Parking'],
                    shopping: ['Clothes', 'Shoes', 'Accessories', 'Online shopping'],
                    entertainment: ['Movie', 'Gaming', 'Concert', 'Streaming subscription'],
                    education: ['Books', 'Course', 'Stationery', 'Project materials'],
                    health: ['Vitamins', 'Medicine', 'Doctor visit', 'Gym'],
                    bills: ['Phone bill', 'Internet', 'Electricity', 'Subscription'],
                    other: ['Gift', 'Donation', 'Miscellaneous']
                };

                note = notes[category][Math.floor(Math.random() * notes[category].length)];
            }

            balance += isIncome ? amount : -amount;

            const hours = Math.floor(Math.random() * 14) + 7;
            const minutes = Math.floor(Math.random() * 60);
            date.setHours(hours, minutes, 0, 0);

            transactions.push({
                id: `txn_${Date.now()}_${i}_${j}`,
                type: isIncome ? 'income' : 'expense',
                amount,
                category,
                note,
                date: date.toISOString(),
            });
        }
    }

    // Calculate total savings
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalSavings = Math.max(0, totalIncome - totalExpense);

    // Determine pet stage
    let stage = 'egg';
    if (totalSavings >= 2000000) stage = 'adult';
    else if (totalSavings >= 500000) stage = 'baby';

    return {
        transactions,
        petProgress: {
            level: stage === 'adult' ? 3 : stage === 'baby' ? 2 : 1,
            stage,
            health: balance > 0 ? 100 : balance === 0 ? 70 : 40,
            totalSavings,
            daysStreak: 15,
            lastTransactionDate: transactions[transactions.length - 1]?.date,
        },
        // Unlock some achievements
        achievements: [
            { id: "first_step", unlocked: true, unlockedAt: transactions[0]?.date },
            { id: "weekly_warrior", unlocked: true, unlockedAt: transactions[7]?.date },
            { id: "budget_master", unlocked: false },
            { id: "save_hero", unlocked: totalSavings >= 100000, unlockedAt: totalSavings >= 100000 ? transactions[10]?.date : null },
            { id: "spending_control", unlocked: false },
            { id: "rich_kid", unlocked: balance >= 1000000, unlockedAt: balance >= 1000000 ? transactions[15]?.date : null },
            { id: "millionaire", unlocked: totalSavings >= 2000000, unlockedAt: totalSavings >= 2000000 ? transactions[20]?.date : null },
            { id: "consistent", unlocked: false },
        ],
    };
};
