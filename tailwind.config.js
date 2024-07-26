/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "320px",
      // => @media (min-width: 320px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        main: {
          // 500: "rgb(59, 130, 246)",
          // 800: "rgb(30, 64, 175)",
          300: "#6CA69A",
          500: "#00672E",
          800: "#4DCCAD",
        },
      },
      fontFamily: {
        poppins: ["Poppins"],
        jost: ["Jost"],
      },
      fontSize: {
        xxs: ["10px"],
      },
    },
  },

  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
