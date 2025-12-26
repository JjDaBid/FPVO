/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // 1. SISTEMA SEMÁNTICO (Semantic System) - PREFERRED
                background: {
                    main: "var(--bg-main)",      // Main page background
                    secondary: "var(--bg-secondary)", // Sidebar, panels
                    surface: "var(--bg-surface)",   // Cards, floaters
                    input: "var(--bg-input)",     // Form inputs
                    highlight: "var(--bg-highlight)"  // Row hovers, accents
                },

                text: {
                    title: "var(--text-title)",
                    subtitle: "var(--text-subtitle)",
                    paragraph: "var(--text-paragraph)",
                    muted: "var(--text-muted)",
                },

                button: {
                    primary: "var(--btn-primary-bg)",
                    "primary-text": "var(--btn-primary-text)",
                    secondary: "var(--btn-secondary-bg)",
                    "secondary-text": "var(--btn-secondary-text)",
                    text: "var(--btn-text-bg)", // Ghost/Text button bg
                    "text-text": "var(--btn-text-text)", // Ghost/Text button text color
                },

                // Borders
                border: {
                    DEFAULT: "var(--border-default)",
                    highlight: "var(--border-highlight)",
                },

                // Status colors
                status: {
                    success: "var(--status-success)",
                    warning: "var(--status-warning)",
                    error: "var(--status-error)",
                    info: "var(--status-info)",
                },

                // 2. COLORES DE MARCA (Brand Colors)
                brand: {
                    DEFAULT: "var(--color-brand)",
                    hover: "var(--color-brand-hover)",
                    // light: "rgba(19, 91, 236, 0.1)", // Hard to verify without rgba parser, keeping as hex/rgba or moving to var if needed. 
                    // To keep it scalable, better to use opacity with CSS var, e.g. "rgb(var(--color-brand-rgb) / 0.1)"
                    // For now, leaving as specific value or mapping to a var if strictly needed. I'll keep the hex for now for simplicity of the "light" variant unless asked.
                    light: "#135bec1a"
                },

                // 3. COMPATIBILIDAD (Legacy / Deprecated) - Maps to new vars
                app: {
                    bg: {
                        main: "var(--bg-main)",
                        secondary: "var(--bg-secondary)",
                        surface: "var(--bg-surface)",
                        input: "var(--bg-input)",
                        highlight: "var(--bg-highlight)"
                    },
                    text: {
                        title: "var(--text-title)",
                        subtitle: "var(--text-subtitle)",
                        body: "var(--text-paragraph)",
                        muted: "var(--text-muted)",
                    },
                    border: {
                        DEFAULT: "var(--border-default)",
                        highlight: "var(--border-highlight)",
                    },
                    status: {
                        success: "var(--status-success)",
                        warning: "var(--status-warning)",
                        error: "var(--status-error)",
                        info: "var(--status-info)",
                    },
                    btn: {
                        secondary: "var(--btn-secondary-bg)",
                        "secondary-hover": "#2f3e5c" // This one was specific, leaving as hex or needs var
                    }
                },
            },
            fontFamily: {
                "display": ["Manrope", "Lexend", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
        },
    },
    plugins: [],
}
