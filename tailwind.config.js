/** @type {import('tailwindcss').Config} */

import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: "#5E8C61",
        offwhite: "#EEEEEE",
        offblack: "#131313",
        skyblue: "#A7CCED",
        lightviolet: "#9984D4",
      },
    },
    container: {
      center: true,
      padding: {
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    },
  },
  plugins: [forms],
};
