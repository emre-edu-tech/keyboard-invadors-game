/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b1f',
        panel: '#15153a',
        accent: '#3ee0ff',
        typed: '#7cffb2',
        danger: '#ff5a6e',
        text: '#f2f4ff',
        muted: '#8a8fb8',
      },
      fontFamily: {
        ui: ['Nunito', 'system-ui', 'sans-serif'],
        title: ['KenVector Future', 'Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
