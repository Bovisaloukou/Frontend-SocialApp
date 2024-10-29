// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Inclut tous les fichiers dans le dossier src
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite', // Animation de respiration
        'spin-slow': 'spin 8s linear infinite',        // Animation de rotation lente
        'bounce-slow': 'bounce 3s infinite',           // Animation de rebond
      },
    },
  },
  plugins: [],
}