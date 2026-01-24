/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                // Custom colors from screenshot if needed
                'teal-dark': '#0f766e', // Approximation
            }
        },
    },
    plugins: [],
}
