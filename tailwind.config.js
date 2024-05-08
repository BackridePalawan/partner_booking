/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#7cae41",
        "primary-dark": "#4c6c33",
        secondary: "#1f3f56",
        link: "#418fde",
      },
      fontSize: {
        12: "12px",
        16: "16px",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
