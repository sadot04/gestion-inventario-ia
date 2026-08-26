/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { tinta: '#17212b', papel: '#f4f7f8', coral: '#ef6f61', verde: '#2a9d8f' }, fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] } } },
  plugins: [],
}