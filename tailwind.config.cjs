/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "text-blue-600",
    "bg-slate-50",
    "text-red-500"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
