
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"app/**/*.{ts,tsx}",
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
				echoo: {
					light: '#E6F2FF',
					DEFAULT: '#8BB8E8',
					dark: '#5D8CB3',
					accent: '#B19CD9',
					text: '#4A5568'
				},
				// New Luma-inspired colors
				luma: {
					blue: {
						light: '#4D91FF',
						DEFAULT: '#3B82F6',
						dark: '#2563EB'
					},
					orange: {
						light: '#FF9F56',
						DEFAULT: '#FF8730',
						dark: '#E06C1F'
					},
					glass: {
						light: 'rgba(255, 255, 255, 0.1)',
						DEFAULT: 'rgba(255, 255, 255, 0.15)',
						dark: 'rgba(255, 255, 255, 0.2)'
					}
				},
				// Theme-specific colors
				kids: {
					primary: '#FF6B6B',
					secondary: '#4ECDC4',
					accent: '#FFE66D',
					background: '#F7FFF7',
					card: '#FFADE3',
				},
				elderly: {
					primary: '#4A5568',
					secondary: '#718096',
					accent: '#A0AEC0',
					background: '#F7FAFC',
					card: '#EDF2F7',
				},
				feminine: {
					primary: '#D53F8C',
					secondary: '#B83280',
					accent: '#FBB6CE',
					background: '#FFF5F7',
					card: '#FED7E2',
				},
				masculine: {
					primary: '#2B6CB0',
					secondary: '#2C5282',
					accent: '#4299E1',
					background: '#EBF8FF',
					card: '#BEE3F8',
				},
				cyber: {
					primary: '#00F5FF',
					secondary: '#0D0221',
					accent: '#7700FF',
					background: '#0D0221',
					card: '#190535',
				}
			},
			fontSize: {
				// Custom font sizes for accessibility
				'elderly-base': '1.25rem',
				'elderly-lg': '1.5rem',
				'elderly-xl': '1.875rem',
				'elderly-2xl': '2.25rem',
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
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				// Kids theme animations
				'bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'kids-bounce': 'bounce 2s ease-in-out infinite',
				'kids-float': 'float 3s ease-in-out infinite'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(4px)',
				'blur-md': 'blur(8px)',
				'blur-lg': 'blur(16px)',
				'blur-xl': 'blur(24px)',
				'blur-2xl': 'blur(40px)',
				'blur-3xl': 'blur(64px)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
