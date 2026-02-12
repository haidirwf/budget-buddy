import { motion } from 'framer-motion';
import { Lock, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Pet from '../components/Pet';
import { achievementDefinitions, calculateProgress } from '../utils/achievements';

const PetInfo = ({ data, onUpdatePetName }) => {
    const [carouselIndex, setCarouselIndex] = useState(data.petProgress.level - 1);
    
    const petStages = [
        { stage: 'egg', level: 1, unlocked: true, requirement: 0 },
        { stage: 'baby', level: 2, unlocked: data.petProgress.totalSavings >= 500000, requirement: 500000 },
        { stage: 'adult', level: 3, unlocked: data.petProgress.totalSavings >= 2000000, requirement: 2000000 },
    ];

    const nextCarousel = () => {
        setCarouselIndex((prev) => (prev + 1) % petStages.length);
    };

    const prevCarousel = () => {
        setCarouselIndex((prev) => (prev - 1 + petStages.length) % petStages.length);
    };

    const getLeftToUnlock = (requirement) => {
        const left = requirement - data.petProgress.totalSavings;
        return Math.max(0, left);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getNextStageInfo = () => {
        if (data.petProgress.stage === 'egg') {
            return { next: 'Baby', requirement: formatCurrency(500000) };
        }
        if (data.petProgress.stage === 'baby') {
            return { next: 'Adult', requirement: formatCurrency(2000000) };
        }
        return { next: 'Max Level!', requirement: 'Completed' };
    };

    const nextStage = getNextStageInfo();

    return (
        <div className="min-h-screen pb-24 px-4 pt-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Pet Info & Achievements</h1>

            {/* Pet Display */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card mb-6 text-center"
            >
                <div className="flex justify-center mb-4">
                    <Pet stage={data.petProgress.stage} mood="happy" animate="idle" />
                </div>

                <h2 className="text-2xl font-bold mb-2">{data.profile.petName}</h2>
                <p className="text-gray-500 dark:text-gray-400 capitalize mb-4">
                    {data.petProgress.stage} • Level {data.petProgress.level}
                </p>

                <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Health</p>
                        <p className="font-bold text-lg">{data.petProgress.health}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
                        <p className="font-bold text-lg">{formatCurrency(data.petProgress.totalSavings)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Streak</p>
                        <p className="font-bold text-lg">{data.petProgress.daysStreak} days</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Next Stage</p>
                        <p className="font-bold text-lg">{nextStage.next}</p>
                    </div>
                </div>

                {data.petProgress.stage !== 'adult' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Save {nextStage.requirement} to evolve
                        </p>
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
            </motion.div>

            {/* Achievements */}
            <h2 className="text-xl font-bold mb-4">Achievements</h2>
            <div className="grid grid-cols-2 gap-4">
                {data.achievements.map((achievement, index) => {
                    const def = achievementDefinitions[achievement.id];
                    const progress = calculateProgress(achievement.id, data);
                    const isUnlocked = achievement.unlocked;

                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`card p-4 ${isUnlocked
                                    ? 'bg-gradient-to-br from-light-primary/10 to-light-success/10 dark:from-dark-primary/10 dark:to-dark-success/10'
                                    : 'opacity-60'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="text-4xl">{def.icon}</div>
                                {isUnlocked ? (
                                    <div className="bg-light-success dark:bg-dark-success rounded-full p-1">
                                        <Check size={16} className="text-white" />
                                    </div>
                                ) : (
                                    <Lock size={20} className="text-gray-400" />
                                )}
                            </div>
                            <h3 className="font-bold mb-1">{def.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{def.description}</p>

                            {!isUnlocked && (
                                <div>
                                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-light-primary dark:bg-dark-primary rounded-full"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progress.toFixed(0)}%</p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default PetInfo;
