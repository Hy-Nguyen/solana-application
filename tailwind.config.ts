import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: "#FFF",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition:
              "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition:
              "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({ addCommonColors: true }),
    addVariablesForColors,
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({
  addBase,
  theme,
}: any) {
  let allColors = flattenColorPalette(
    theme("colors")
  );
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(
      ([key, val]) => [`--${key}`, val]
    )
  );

  addBase({
    ":root": newVars,
  });
}
export default config;
