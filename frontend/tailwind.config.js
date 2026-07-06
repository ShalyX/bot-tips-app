/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "secondary": "#d0bcff",
        "surface-tint": "#abd600",
        "inverse-on-surface": "#313031",
        "error": "#ffb4ab",
        "on-primary-fixed": "#161e00",
        "inverse-surface": "#e5e2e3",
        "secondary-container": "#571bc1",
        "on-error": "#690005",
        "primary-container": "#c3f400",
        "surface-bright": "#3a393a",
        "outline-variant": "#444933",
        "on-secondary-fixed": "#23005c",
        "on-error-container": "#ffdad6",
        "surface": "#131314",
        "surface-dim": "#131314",
        "surface-container-highest": "#353436",
        "on-secondary": "#3c0091",
        "on-tertiary-fixed-variant": "#004f54",
        "on-primary-container": "#556d00",
        "secondary-fixed": "#e9ddff",
        "tertiary-fixed-dim": "#00dbe9",
        "inverse-primary": "#506600",
        "on-secondary-fixed-variant": "#5516be",
        "surface-variant": "#353436",
        "on-primary": "#283500",
        "on-tertiary-container": "#006f77",
        "on-tertiary": "#00363a",
        "on-secondary-container": "#c4abff",
        "on-primary-fixed-variant": "#3c4d00",
        "background": "#131314",
        "secondary-fixed-dim": "#d0bcff",
        "on-background": "#e5e2e3",
        "on-surface": "#e5e2e3",
        "primary-fixed": "#c3f400",
        "surface-container": "#201f20",
        "surface-container-lowest": "#0e0e0f",
        "surface-container-low": "#1c1b1c",
        "tertiary-fixed": "#7df4ff",
        "on-tertiary-fixed": "#002022",
        "primary-fixed-dim": "#abd600",
        "error-container": "#93000a",
        "primary": "#ffffff",
        "surface-container-high": "#2a2a2b",
        "outline": "#8e9379",
        "on-surface-variant": "#c4c9ac",
        "tertiary": "#ffffff",
        "tertiary-container": "#7df4ff"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "container-max": "1280px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "unit": "4px",
        "stack-gap": "12px"
      },
      "fontFamily": {
        "headline-xl": ["Geist", "sans-serif"],
        "button-text": ["Geist", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-lg": ["Geist", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Geist", "sans-serif"],
        "code-label": ["JetBrains Mono", "monospace"]
      },
      "fontSize": {
        "headline-xl": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700" }],
        "button-text": ["14px", { "lineHeight": "1.0", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.6", "letterSpacing": "0em", "fontWeight": "400" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "code-label": ["13px", { "lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "500" }]
      }
    }
  },
  plugins: [],
}
