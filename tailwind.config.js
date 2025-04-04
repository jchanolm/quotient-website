/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './*.js',
  ],
  theme: {
    extend: {
      colors: {
        'blue-primary': '#0057ff',
        'blue-bright': '#00a0ff',
        'blue-glow': 'rgba(0, 87, 255, 0.4)',
        'purple-warpcast': '#8a63d2',
        'purple-glow': 'rgba(138, 99, 210, 0.4)',
        'bg-dark': '#0a0a18',
        'bg-darker': '#05050d',
        'text-muted': '#ccccdd',
        'eth-color': '#62a9ff',
        'sol-color': '#14f195'
      },
      backgroundColor: {
        'card': 'rgba(15, 15, 30, 0.7)'
      },
      borderColor: {
        'default': 'rgba(80, 80, 120, 0.4)'
      }
    },
  },
  plugins: [],
}

