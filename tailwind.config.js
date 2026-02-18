/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
    screens: {
      xxs: { max: "480px" }, // móvil extra pequeño
      xs: { max: "510px" },  // móvil pequeño
      sm: { max: "767px" },  // tablet / móvil grande
      md: { max: "990px" },  // ordenador pantalla pequeña
      lg: "991px",           // desde aquí full HD
    },
  },
  plugins: [],
};