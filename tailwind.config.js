/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                light: {
                    bg: '#ffffff',
                    surface: '#f8fafc',
                    primary: '#3b82f6',
                    success: '#10b981',
                    danger: '#ef4444',
                    text: '#1e293b',
                },
                dark: {
                    bg: '#0f172a',
                    surface: '#1e293b',
                    primary: '#60a5fa',
                    success: '#34d399',
                    danger: '#f87171',
                    text: '#f1f5f9',
                }
            },
            animation: {
                'bounce-slow': 'bounce 2s ease-in-out infinite',
                'breathe': 'breathe 3s ease-in-out infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                }
            }
        },
    },
    plugins: [],
}
