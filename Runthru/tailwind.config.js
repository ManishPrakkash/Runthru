
module.exports = {
  darkMode: 'class', // Enable dark mode based on the 'dark' class in HTML
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'fira-code': ['Fira Code', 'monospace'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Define a subtle color palette if needed, or rely on default Tailwind grays/blues
        // Example for soft gradients or accents
        'primary-light': '#f8f7f4', // Very light background
        'secondary-light': '#e0e7ee', // Slightly darker background
        'primary-dark': '#1a202c', // Dark background
        'secondary-dark': '#2d3748', // Slightly lighter dark background
      },
    },
  },
  plugins: [],
}