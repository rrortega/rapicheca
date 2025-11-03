export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      // Configuración optimizada para producción
      grid: false, // Desactivar grid fallbacks para mejor rendimiento
      remove: true, // Remover comentarios innecesarios
    },
    // Plugin de purga CSS para producción
    ...(process.env.BUILD_MODE === 'prod' ? {
      '@fullhuman/postcss-purgecss': {
        content: [
          './src/**/*.{js,jsx,ts,tsx}',
          './public/index.html',
          './index.html',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: {
          deep: [/^data-/, /^aria-/, /^role-/],
          greedy: [/^bg-/, /^text-/, /^border-/, /^shadow-/],
        },
      },
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          calc: false,
          convertValues: true,
          discardDuplicates: true,
          discardEmpty: true,
          discardUnused: false,
          mergeLonghand: true,
          mergeRules: true,
          normalizeCharset: true,
          normalizeDisplayValues: true,
          normalizePositions: true,
          reduceFontSizes: true,
          removeEmpty: true,
          removeRedundantAttributes: true,
          removeUnusedAtRules: false,
          reorderRules: true,
          suppressErrors: true,
          uniqueSelectors: true,
          zeroUnits: true,
        }],
      },
    } : {}),
    // Compresión adicional para archivos CSS
    ...(process.env.BUILD_MODE === 'prod' ? {
      'postcss-combine-duplicated-selectors': {
        removeDuplicatedValues: true,
      },
      'postcss-merge-longhand': true,
      'postcss-merge-rules': true,
      'postcss-discard-comments': {
        remove: 'all',
        preserve: false,
      },
    } : {}),
  },
};
