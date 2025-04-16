
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				cyber: {
					'bg': '#0f1a2c',
					'accent': '#00b3fe',
					'accent-glow': '#00b3fe80',
					'neon': '#00ffe1',
					'neon-alt': '#e100ff',
					'grid': '#1e2a3a',
					'text': '#ffffff',
					'muted': '#8a9ab0'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(1) blur(0px)'
					},
					'50%': { 
						opacity: '0.6',
						filter: 'brightness(1.2) blur(2px)'
					}
				},
				'flow-right': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'gradient-x': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'data-pulse': {
					'0%': { 
						opacity: '0.4',
						transform: 'scale(0.95)'
					},
					'50%': { 
						opacity: '1',
						transform: 'scale(1)'
					},
					'100%': { 
						opacity: '0.4',
						transform: 'scale(0.95)'
					}
				},
				'scanning': {
					'0%': { 
						transform: 'translateY(0)',
						opacity: '0.5',
						background: 'linear-gradient(to bottom, rgba(0,179,254,0.1), rgba(0,179,254,0.3), rgba(0,179,254,0.1))'
					},
					'100%': { 
						transform: 'translateY(100%)',
						opacity: '0',
						background: 'linear-gradient(to bottom, rgba(0,179,254,0.1), rgba(0,179,254,0.3), rgba(0,179,254,0.1))'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'flow-right': 'flow-right 3s linear infinite',
				'float': 'float 3s ease-in-out infinite',
				'gradient-x': 'gradient-x 3s ease infinite',
				'data-pulse': 'data-pulse 2s ease-in-out infinite',
				'scanning': 'scanning 2s linear infinite'
			},
			fontFamily: {
				'cyber': ['Orbitron', 'sans-serif'],
				'chinese': ['"ZCOOL QingKe HuangYou"', 'sans-serif']
			},
			boxShadow: {
				'neon': '0 0 5px theme("colors.cyber.accent"), 0 0 20px theme("colors.cyber.accent-glow")',
				'neon-strong': '0 0 10px theme("colors.cyber.accent"), 0 0 30px theme("colors.cyber.accent-glow")',
				'neon-inner': 'inset 0 0 5px theme("colors.cyber.accent"), inset 0 0 10px theme("colors.cyber.accent-glow")'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
