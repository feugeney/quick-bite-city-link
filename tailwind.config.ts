
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
					DEFAULT: '#C41E3A', // Rouge guinéen moderne
					foreground: '#FFFFFF',
					50: '#FEF2F2',
					100: '#FEE2E2',
					200: '#FECACA',
					300: '#FCA5A5',
					400: '#F87171',
					500: '#C41E3A',
					600: '#B91C1C',
					700: '#991B1B',
					800: '#7F1D1D',
					900: '#651419'
				},
				secondary: {
					DEFAULT: '#FFD700', // Or guinéen
					foreground: '#1F2937',
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#FFD700',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F'
				},
				accent: {
					DEFAULT: '#059669', // Vert forêt guinéenne
					foreground: '#FFFFFF',
					50: '#ECFDF5',
					100: '#D1FAE5',
					200: '#A7F3D0',
					300: '#6EE7B7',
					400: '#34D399',
					500: '#059669',
					600: '#047857',
					700: '#065F46',
					800: '#064E3B',
					900: '#022C22'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
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
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'pulse-custom': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-5px)',
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
					}
				},
				'guinea-wave': {
					'0%, 100%': {
						transform: 'scaleX(1)'
					},
					'50%': {
						transform: 'scaleX(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'pulse-custom': 'pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-gentle': 'bounce-gentle 1s infinite',
				'guinea-wave': 'guinea-wave 3s ease-in-out infinite'
			},
			backgroundImage: {
				'guinea-pattern': 'linear-gradient(45deg, #C41E3A 25%, transparent 25%), linear-gradient(-45deg, #C41E3A 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #FFD700 75%), linear-gradient(-45deg, transparent 75%, #FFD700 75%)',
				'guinea-gradient': 'linear-gradient(135deg, #C41E3A 0%, #FFD700 50%, #059669 100%)',
				'guinea-subtle': 'linear-gradient(120deg, #FEF2F2 0%, #FFFBEB 50%, #ECFDF5 100%)'
			},
			fontFamily: {
				'guinea': ['Inter', 'system-ui', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
