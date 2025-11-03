module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bronze: '#A39161',
        taupe: '#484349',
        pine: '#057A75',
        pagebg: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'soft-lg': '0 8px 24px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
