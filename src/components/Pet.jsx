import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Pet = ({ stage = 'egg', mood = 'neutral', animate = 'idle', onClick }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (animate !== 'idle') {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [animate]);

    const getPetColor = () => {
        if (mood === 'happy') return '#34d399';
        if (mood === 'sad') return '#f87171';
        return '#60a5fa';
    };

    const renderEgg = () => (
        <motion.div
            className={`relative ${isAnimating ? '' : 'animate-breathe'}`}
            animate={isAnimating && animate === 'happy' ? {
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
            } : isAnimating && animate === 'sad' ? {
                x: [-5, 5, -5, 5, 0],
            } : {}}
            transition={{ duration: 0.6 }}
        >
            <svg width="200" height="240" viewBox="0 0 200 240" className="">
                {/* Egg body */}
                <ellipse cx="100" cy="140" rx="70" ry="90" fill={getPetColor()} opacity="0.9" />
                <ellipse cx="100" cy="140" rx="60" ry="80" fill={getPetColor()} />

                {/* Spots */}
                <ellipse cx="70" cy="120" rx="15" ry="20" fill="white" opacity="0.3" />
                <ellipse cx="130" cy="130" rx="12" ry="18" fill="white" opacity="0.3" />
                <ellipse cx="90" cy="170" rx="10" ry="15" fill="white" opacity="0.3" />

                {/* Eyes */}
                <circle cx="80" cy="130" r="8" fill="white" />
                <circle cx="120" cy="130" r="8" fill="white" />
                <circle cx="82" cy="130" r="5" fill="#1e293b" />
                <circle cx="122" cy="130" r="5" fill="#1e293b" />

                {/* Mouth */}
                {mood === 'happy' && (
                    <path d="M 85 150 Q 100 160 115 150" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                )}
                {mood === 'sad' && (
                    <path d="M 85 155 Q 100 145 115 155" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                )}
                {mood === 'neutral' && (
                    <line x1="85" y1="150" x2="115" y2="150" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                )}

                {/* Sparkles when happy */}
                {mood === 'happy' && (
                    <>
                        <motion.g animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                            <path d="M 40 100 L 42 105 L 47 107 L 42 109 L 40 114 L 38 109 L 33 107 L 38 105 Z" fill="#fbbf24" />
                        </motion.g>
                        <motion.g animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}>
                            <path d="M 160 110 L 162 115 L 167 117 L 162 119 L 160 124 L 158 119 L 153 117 L 158 115 Z" fill="#fbbf24" />
                        </motion.g>
                    </>
                )}
            </svg>
        </motion.div>
    );

    const renderBaby = () => (
        <motion.div
            className={`relative ${isAnimating ? '' : 'animate-breathe'}`}
            animate={isAnimating && animate === 'happy' ? {
                y: [0, -30, -10, -35, 0],
                rotate: [0, -10, 10, -5, 0],
            } : isAnimating && animate === 'sad' ? {
                x: [-5, 5, -5, 5, 0],
                rotate: [0, -3, 3, -3, 0],
            } : {}}
            transition={{ duration: 0.8 }}
        >
            <svg width="220" height="260" viewBox="0 0 220 260" className="drop-shadow-2xl">
                {/* Body */}
                <ellipse cx="110" cy="160" rx="65" ry="75" fill={getPetColor()} opacity="0.9" />
                <ellipse cx="110" cy="160" rx="55" ry="65" fill={getPetColor()} />

                {/* Head */}
                <circle cx="110" cy="90" r="50" fill={getPetColor()} opacity="0.9" />
                <circle cx="110" cy="90" r="42" fill={getPetColor()} />

                {/* Ears */}
                <ellipse cx="70" cy="70" rx="18" ry="25" fill={getPetColor()} opacity="0.8" />
                <ellipse cx="150" cy="70" rx="18" ry="25" fill={getPetColor()} opacity="0.8" />

                {/* Eyes */}
                <circle cx="90" cy="85" r="10" fill="white" />
                <circle cx="130" cy="85" r="10" fill="white" />
                <circle cx="92" cy="85" r="6" fill="#1e293b" />
                <circle cx="132" cy="85" r="6" fill="#1e293b" />
                <circle cx="94" cy="83" r="2" fill="white" />
                <circle cx="134" cy="83" r="2" fill="white" />

                {/* Blush */}
                <ellipse cx="65" cy="95" rx="8" ry="5" fill="#f87171" opacity="0.4" />
                <ellipse cx="155" cy="95" rx="8" ry="5" fill="#f87171" opacity="0.4" />

                {/* Mouth */}
                {mood === 'happy' && (
                    <>
                        <path d="M 95 105 Q 110 115 125 105" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <circle cx="110" cy="112" r="3" fill="#f87171" />
                    </>
                )}
                {mood === 'sad' && (
                    <>
                        <path d="M 95 110 Q 110 100 125 110" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
                        {/* Tear */}
                        <motion.ellipse
                            cx="85" cy="95" rx="3" ry="5" fill="#60a5fa"
                            animate={{ y: [0, 10], opacity: [1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </>
                )}
                {mood === 'neutral' && (
                    <ellipse cx="110" cy="105" rx="12" ry="8" fill="#1e293b" opacity="0.8" />
                )}

                {/* Arms */}
                <ellipse cx="55" cy="140" rx="12" ry="30" fill={getPetColor()} opacity="0.8" transform="rotate(-20 55 140)" />
                <ellipse cx="165" cy="140" rx="12" ry="30" fill={getPetColor()} opacity="0.8" transform="rotate(20 165 140)" />

                {/* Legs */}
                <ellipse cx="85" cy="220" rx="18" ry="25" fill={getPetColor()} opacity="0.9" />
                <ellipse cx="135" cy="220" rx="18" ry="25" fill={getPetColor()} opacity="0.9" />

                {/* Sparkles */}
                {mood === 'happy' && (
                    <>
                        {[0, 1, 2].map((i) => (
                            <motion.g
                                key={i}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0.5, 1, 0.5],
                                    y: [-5, -15, -5]
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            >
                                <path
                                    d={`M ${30 + i * 60} 50 L ${32 + i * 60} 55 L ${37 + i * 60} 57 L ${32 + i * 60} 59 L ${30 + i * 60} 64 L ${28 + i * 60} 59 L ${23 + i * 60} 57 L ${28 + i * 60} 55 Z`}
                                    fill="#fbbf24"
                                />
                            </motion.g>
                        ))}
                    </>
                )}
            </svg>
        </motion.div>
    );

    const renderAdult = () => (
        <motion.div
            className={`relative ${isAnimating ? '' : 'animate-breathe'}`}
            animate={isAnimating && animate === 'happy' ? {
                y: [0, -40, -15, -45, -10, 0],
                rotate: [0, -15, 15, -10, 10, 0],
                scale: [1, 1.1, 1.05, 1.1, 1.05, 1],
            } : isAnimating && animate === 'sad' ? {
                x: [-8, 8, -8, 8, 0],
                y: [0, 2, 0, 2, 0],
            } : {}}
            transition={{ duration: 1 }}
        >
            <svg width="260" height="300" viewBox="0 0 260 300" className="drop-shadow-2xl">
                {/* Body */}
                <ellipse cx="130" cy="180" rx="75" ry="90" fill={getPetColor()} opacity="0.95" />
                <ellipse cx="130" cy="180" rx="65" ry="80" fill={getPetColor()} />

                {/* Head */}
                <circle cx="130" cy="95" r="60" fill={getPetColor()} opacity="0.95" />
                <circle cx="130" cy="95" r="52" fill={getPetColor()} />

                {/* Crown/Horns */}
                <path d="M 85 60 L 90 35 L 95 60" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 130 45 L 130 20 L 130 45" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 165 60 L 170 35 L 175 60" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />

                {/* Ears */}
                <ellipse cx="70" cy="80" rx="20" ry="30" fill={getPetColor()} opacity="0.8" />
                <ellipse cx="190" cy="80" rx="20" ry="30" fill={getPetColor()} opacity="0.8" />
                <ellipse cx="70" cy="80" rx="10" ry="18" fill="white" opacity="0.3" />
                <ellipse cx="190" cy="80" rx="10" ry="18" fill="white" opacity="0.3" />

                {/* Eyes */}
                <circle cx="105" cy="90" r="14" fill="white" />
                <circle cx="155" cy="90" r="14" fill="white" />
                <circle cx="108" cy="90" r="9" fill="#1e293b" />
                <circle cx="158" cy="90" r="9" fill="#1e293b" />
                <circle cx="111" cy="87" r="4" fill="white" />
                <circle cx="161" cy="87" r="4" fill="white" />

                {/* Blush */}
                <ellipse cx="55" cy="100" rx="12" ry="8" fill="#f87171" opacity="0.5" />
                <ellipse cx="205" cy="100" rx="12" ry="8" fill="#f87171" opacity="0.5" />

                {/* Mouth */}
                {mood === 'happy' && (
                    <>
                        <path d="M 105 115 Q 130 130 155 115" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <path d="M 115 120 Q 130 128 145 120" stroke="#f87171" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </>
                )}
                {mood === 'sad' && (
                    <>
                        <path d="M 105 120 Q 130 108 155 120" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
                        <motion.ellipse
                            cx="95" cy="95" rx="4" ry="7" fill="#60a5fa"
                            animate={{ y: [0, 15], opacity: [1, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        />
                        <motion.ellipse
                            cx="165" cy="95" rx="4" ry="7" fill="#60a5fa"
                            animate={{ y: [0, 15], opacity: [1, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                        />
                    </>
                )}
                {mood === 'neutral' && (
                    <ellipse cx="130" cy="115" rx="15" ry="10" fill="#1e293b" opacity="0.8" />
                )}

                {/* Arms */}
                <ellipse cx="50" cy="160" rx="15" ry="40" fill={getPetColor()} opacity="0.85" transform="rotate(-25 50 160)" />
                <ellipse cx="210" cy="160" rx="15" ry="40" fill={getPetColor()} opacity="0.85" transform="rotate(25 210 160)" />
                <circle cx="45" cy="190" r="18" fill={getPetColor()} opacity="0.9" />
                <circle cx="215" cy="190" r="18" fill={getPetColor()} opacity="0.9" />

                {/* Legs */}
                <ellipse cx="100" cy="255" rx="22" ry="35" fill={getPetColor()} opacity="0.95" />
                <ellipse cx="160" cy="255" rx="22" ry="35" fill={getPetColor()} opacity="0.95" />

                {/* Belly pattern */}
                <ellipse cx="130" cy="180" rx="35" ry="50" fill="white" opacity="0.2" />

                {/* Confetti when happy */}
                {mood === 'happy' && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <motion.circle
                                key={i}
                                cx={60 + i * 30}
                                cy={30}
                                r={4}
                                fill={['#fbbf24', '#f87171', '#60a5fa', '#34d399'][i % 4]}
                                animate={{
                                    y: [0, 100, 200],
                                    x: [(i % 2 === 0 ? -1 : 1) * 20, (i % 2 === 0 ? 1 : -1) * 10, 0],
                                    opacity: [1, 1, 0],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </>
                )}
            </svg>
        </motion.div>
    );

    return (
        <div
            className="flex items-center justify-center cursor-pointer select-none"
            onClick={onClick}
        >
            {stage === 'egg' && renderEgg()}
            {stage === 'baby' && renderBaby()}
            {stage === 'adult' && renderAdult()}
        </div>
    );
};

export default Pet;
