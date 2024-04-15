/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/**/*.{ts,tsx}"],
  plugins: [require("prettier-plugin-tailwindcss")],
  theme: {
    colors: {
      background: "hsl(var(--background))",
      black: "#1A1523",
      btn: {
        background: "hsl(var(--btn-background))",
        "background-hover": "hsl(var(--btn-background-hover))",
      },
      foreground: "hsl(var(--foreground))",
      gray: "#6F6E77",
      lightGray: "#DCDBDD",
      tomato: "#CA3214",
      white: "#FFFFFF",
    },
    extend: {},
  },
};
