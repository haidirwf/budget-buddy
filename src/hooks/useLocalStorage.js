import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

// Initial data structure
export const getInitialData = () => ({
    profile: {
        name: "Student",
        petName: "Buddy",
        currency: "IDR",
        monthlyBudget: 2000000,
        createdAt: new Date().toISOString(),
    },
    transactions: [],
    petProgress: {
        level: 1,
        stage: "egg",
        health: 100,
        totalSavings: 0,
        daysStreak: 0,
        lastTransactionDate: null,
    },
    achievements: [
        { id: "first_step", unlocked: false },
        { id: "weekly_warrior", unlocked: false },
        { id: "budget_master", unlocked: false },
        { id: "save_hero", unlocked: false },
        { id: "spending_control", unlocked: false },
        { id: "rich_kid", unlocked: false },
        { id: "millionaire", unlocked: false },
        { id: "consistent", unlocked: false },
    ],
});
