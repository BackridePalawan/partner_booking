/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    screens: {
      xs: "480px", // New breakpoint for extra-small screens
      sm: "708px",
      md: "790px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
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
