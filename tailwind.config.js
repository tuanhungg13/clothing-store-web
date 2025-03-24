/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/component/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary, #1F984D)",
        secondary: "var(--secondary)",
        background: "var(--background,#fff)",
        bgSecondary: "var(--bgSecondary,#F7F9F9)",
        textHeading: "var(--textHeading)",
        textButton: "var(--textButton, #fff)",
        textSecondary: "var(--textSecondary)",
        textBody: "var(--textBody, #292929)",
        background2: "#fff",
        background3: "#F7F9F9",
        gray1: "#333333",
        gray2: "#4E4E4E",
        gray3: "#828282",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
        gray6: "#FAFAFA",
        info: "#3583EA",
        success: "#30AD63",
        warning: "#E1B848",
        danger: "#E54D42",
        stroke: "#DDDDDD",
        border: "#ccc",
      },
    },
  },
  plugins: [],
};
