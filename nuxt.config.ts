export default defineNuxtConfig({
  css: ["/public/assets/css/tailwind.css"], // Подключаем Tailwind CSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: "2024-11-02",
});