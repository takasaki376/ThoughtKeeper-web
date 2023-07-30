/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/**/*.{ts,tsx}"],
  plugins: [require('prettier-plugin-tailwindcss')],
  theme: {
    colors: {
      black: "#1A1523",
      gray: "#6F6E77",
      lightGray: "#DCDBDD",
      tomato: "#CA3214",
      white: "#FFFFFF",
    },
    extend: {},
  },
}
