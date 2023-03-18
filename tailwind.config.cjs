const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ProzaLibre", ...defaultTheme.fontFamily.sans],
        serif: ["Cormorant", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase([{
        '@font-face': {
          fontFamily: 'Cormorant',
          src: "url('/fonts/Cormorant-Bold.woff') format('woff')"
        }
      }, {
        '@font-face': {
          fontFamily: 'ProzaLibre',
          src: "url('/fonts/ProzaLibre-Regular.woff') format('woff')"
        }
      }, {
        "h1": { fontFamily: "Cormorant" }
      }]);
    }
  ]
};
