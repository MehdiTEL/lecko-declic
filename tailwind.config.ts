import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        // heading: Inter — modernité, lisibilité haute densité (titres)
        // sans: Source Sans 3 — charte DÉCLIC, corps de texte
        sans: ["'Source Sans 3'", "Calibri", "sans-serif"],
        heading: ["'Inter'", "system-ui", "sans-serif"],
        // Espace consultant
        consultant: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      fontSize: {
        "display": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],
        "heading-xl": ["3rem", { lineHeight: "1.12", letterSpacing: "-0.025em", fontWeight: "700" }],
        "heading-lg": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-md": ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.25rem", { lineHeight: "1.7" }],
        "body": ["1.125rem", { lineHeight: "1.7" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "foreground-secondary": "hsl(var(--foreground-secondary))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        "foreground-light": "hsl(var(--foreground-light))",
        surface: "hsl(var(--surface))",
        "surface-alt": "hsl(var(--surface-alt))",
        "surface-accent": "hsl(var(--surface-accent))",
        brand: {
          blue: "hsl(var(--brand-blue))",
          orange: "hsl(var(--brand-orange))",
          green: "hsl(var(--brand-green))",
        },
        /* Semantic green */
        gr33t: {
          DEFAULT: "hsl(var(--brand-green))",
          50: "hsl(152 81% 96%)",
          100: "hsl(149 80% 90%)",
          200: "hsl(152 76% 80%)",
          300: "hsl(156 72% 67%)",
          400: "hsl(158 64% 52%)",
          500: "hsl(160 84% 39%)",
          600: "hsl(162 93% 31%)",
          700: "hsl(163 94% 24%)",
          800: "hsl(163 88% 20%)",
          900: "hsl(164 86% 16%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        badge: {
          "auto-bg": "hsl(var(--badge-auto-bg))",
          "auto-text": "hsl(var(--badge-auto-text))",
          "partial-bg": "hsl(var(--badge-partial-bg))",
          "partial-text": "hsl(var(--badge-partial-text))",
          "hard-bg": "hsl(var(--badge-hard-bg))",
          "hard-text": "hsl(var(--badge-hard-text))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        consultant: {
          sidebar: "hsl(var(--consultant-sidebar-bg))",
          border: "hsl(var(--consultant-sidebar-border))",
          text: "hsl(var(--consultant-sidebar-text))",
          muted: "hsl(var(--consultant-sidebar-muted))",
          active: "hsl(var(--consultant-sidebar-active))",
          hover: "hsl(var(--consultant-sidebar-hover))",
        },
        mission: {
          surface: "hsl(var(--mission-surface))",
          alt: "hsl(var(--mission-surface-alt))",
          border: "hsl(var(--mission-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        "elevated": "var(--shadow-elevated)",
        "float": "var(--shadow-float)",
        "editorial": "0 1px 2px 0 hsl(222 47% 11% / 0.04)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-bottom": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.35s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-bottom": "slide-in-bottom 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-out-right": "slide-out-right 0.25s ease-in forwards",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "count-up": "count-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
