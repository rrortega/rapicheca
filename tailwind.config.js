/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	// Configuración optimizada para producción
	presets: [],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2B5D3A',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#4A90E2',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#F5A623',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			// Optimizaciones para producción
			letterSpacing: {
				'tighter': '-0.05em',
				'tight': '-0.025em',
				'normal': '0em',
				'wide': '0.025em',
				'wider': '0.05em',
				'widest': '0.1em',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
			},
		},
	},
	// Optimizaciones para producción
	corePlugins: {
		// Desactivar utilities no utilizados para reducir bundle size
		preflight: process.env.BUILD_MODE !== 'prod', // Solo en desarrollo
		float: false,
		objectFit: false,
		objectPosition: false,
		overscrollBehavior: false,
		isolation: false,
		mixBlendMode: false,
		// Pero mantener importantes para la UI
		scale: true,
		rotate: true,
		skew: true,
		transitionProperty: true,
	},
	// Purge CSS configuration
	purge: {
		enabled: process.env.BUILD_MODE === 'prod',
		content: [
			'./pages/**/*.{js,ts,jsx,tsx}',
			'./components/**/*.{js,ts,jsx,tsx}',
			'./app/**/*.{js,ts,jsx,tsx}',
			'./src/**/*.{js,ts,jsx,tsx}',
			'./index.html',
		],
		options: {
			safelist: {
				deep: [
					/^data-/, /^aria-/, /^role-/,
					/^aria-/, /^data-\w+/,
					/class:bg-/, /class:text-/, /class:border-/, /class:shadow-/
				],
				greedy: [
					/^bg-/, /^text-/, /^border-/, /^shadow-/, /^rounded-/,
					/^p-/, /^m-/, /^gap-/, /^space-/, /^flex-/, /^grid-/
				]
			},
			keyframes: true,
			fontFace: true,
		}
	},
	plugins: [
		require('tailwindcss-animate'),
		// Plugin customizado para optimización
		function({ addUtilities, addComponents, theme }) {
			const newUtilities = {
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none'
					}
				},
				'.scrollbar-thin': {
					'scrollbar-width': 'thin',
					'&::-webkit-scrollbar': {
						width: '6px'
					}
				}
			}

			addUtilities(newUtilities)

			// Componentes optimizados
			const newComponents = {
				'.container': {
					width: '100%',
					marginLeft: 'auto',
					marginRight: 'auto',
					paddingLeft: theme('spacing.4'),
					paddingRight: theme('spacing.4'),
					'@media (min-width: 640px)': {
						maxWidth: '640px'
					},
					'@media (min-width: 768px)': {
						maxWidth: '768px'
					},
					'@media (min-width: 1024px)': {
						maxWidth: '1024px'
					},
					'@media (min-width: 1280px)': {
						maxWidth: '1280px'
					},
					'@media (min-width: 1536px)': {
						maxWidth: '1536px'
					}
				}
			}

			addComponents(newComponents)
		}
	],
	// Optimizaciones de futuro
	future: {
		removeDeprecatedGapUtilities: true,
		pixelscape: true
	},
	// Configuración experimental
	experimental: {
		oracle: false,
		uniformColorPaths: false,
		relativeContentPathsByDefault: false
	}
}