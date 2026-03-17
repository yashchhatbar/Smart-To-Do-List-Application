/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        paper: "#f8fafc",
        brand: {
          50: "#eefbf4",
          100: "#d7f5e5",
          500: "#1f9d62",
          600: "#178353",
          700: "#126844",
        },
      },
      boxShadow: {
        panel: "0 20px 45px -24px rgba(15, 23, 42, 0.35)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(31, 157, 98, 0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.09), transparent 40%)",
      },
    },
  },
  plugins: [],
};
