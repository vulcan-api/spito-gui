/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/renderer/src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#242424",
        bgLight: "#292929",
        bgLighter: "#6d6d6d",
        borderGray: "#4d4d4d"
      },
      dropShadow: {
        main: "0 2px 0 #39393980",
        light: "0 0 6px #ffffff30"
      },
      boxShadow: {
        main: "0 0 2px 2px #393939",
        darkMain:
          "0 6px 10px 0 hsla(0,0%,0%,0.14), 0 1px 18px 0 hsla(0,0%,0%,0.12), 0 3px 5px -1px hsla(0,0%,0%,0.2)"
      },
      fontFamily: {
        roboto: ["Roboto Slab", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      },
      animation: {
        "ping-once": "ping .5s cubic-bezier(0, 0, 0.2, 1) forwards"
      }
    }
  },
  plugins: []
};
