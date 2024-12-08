/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a', // Warna Hijau sebagai warna utama
        secondary: '#f3f4f6',
        textPrimary: '#111827',
        textSecondary: '#4b5563',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Font default untuk aplikasi
      },
    },
  },
  plugins: [],
}