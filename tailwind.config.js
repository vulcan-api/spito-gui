/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#242424",
        bgLight: "#383838",
        bgLightTransparent: "#38383860",
      },
      boxShadow: {
        main: "0 0 32px -15px rgba(255,255,255,0.2)"
      }
    }
  },
  plugins: []
};
