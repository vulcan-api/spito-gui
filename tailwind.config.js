/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#242424",
        bgLight: "#383838",
      },
      dropShadow: {
        main: "0 2px 0 #39393980"
      },
      fontFamily: {
        roboto: ["Roboto Slab", "sans-serif"]
      }
    }
  },
  plugins: []
};
