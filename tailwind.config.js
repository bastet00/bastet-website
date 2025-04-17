/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        main: "#f6831c",
        secondary: "#E7B133",
        third: "#614223",
        titleColor: "#f4931e",
        navBackground: "#312719",
        inputBackground: "#302718",
        lineColor: "#613805",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
