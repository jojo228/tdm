/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "dark-purple":"#081A51",
        "light-purple":"#4338ca",
        "light-white":"rgba(255, 255, 255,0.18)",
        "background-white":"#f3f4f6",
        "docs-blue":"#2b7de9",
      }
    },
  },
  plugins: [],
}
