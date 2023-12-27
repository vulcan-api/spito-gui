/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#242424",
        bgLight: "#292929",
        borderGray: "#4d4d4d"
      },
      dropShadow: {
        main: "0 2px 0 #39393980"
      },
      fontFamily: {
        roboto: ["Roboto Slab", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      }
    }
  },
  plugins: []
};
