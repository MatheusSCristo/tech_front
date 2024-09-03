import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        blueGradiant: "linear-gradient(180deg, #207FD7 0%, #004E96 100%)",
      },
      colors: {
        blue: "#004E96",
        lightBlue: "#207FD7",
        mandatoryBlue:"#64A5E1",
        optionalGray:"#D3D3D3"
      },
    },
  },
  plugins: [],
};
export default config;
