import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        display: ["'Cabinet Grotesk'", "'Inter'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      fontSize: {
        "display": ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],
        "heading-xl": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.025em", fontWeight: "700" }],
        "heading-lg": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-md": ["clamp(1.25rem, 2.5vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["clamp(1rem, 1.5vw, 1.1rem)", { lineHeight: "1.7" }],
        "body": ["clamp(0.95rem, 1.25vw, 1rem)", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "label": ["0.8rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      colors: {
        /* ── Core surfaces ── */
        "bg-primary": "hsl(var(--bg-primary))",
        "bg-secondary": "hsl(var(--bg-secondary))",
        "bg-elevated": "hsl(var(--bg-elevated))",

        /* ── Text ── */
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-muted": "hsl(var(--text-muted))",

        /* ── Accent ── */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          hover: "hsl(var(--accent-hover))",
          secondary: "hsl(var(--accent-secondary))",
          foreground: "hsl(var(--accent-foreground))",
        },

        /* ── Semantic ── */
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",

        /* ── Shadcn compat ── */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
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
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139,92,246,0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(139,92,246,0.25)" },
        },
        "slide-up-fade": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.35s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-out-right": "slide-out-right 0.25s ease-in forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        "count-up": "count-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
