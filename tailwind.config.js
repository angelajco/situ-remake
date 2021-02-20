module.exports = {
  prefix: 'tw-',
  purge: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    fontFamily: {
      'sans': 'Montserrat, sans-serif'
    },
    extend: {
      colors: {
        inst: {
          'crema': '#ddc9a3',
          'dorado': '#bc955c',
          'guinda': '#691c32',
          'rojo': '#9f2241',
          gris: {
            'claro': '#98989a',
            'fuerte': '#6f7271',
          },
          verde: {
            "claro": "#325b4e",
            "fuerte": "#10312b"
          }
        }
      }
    },
    screens: {
      '2xl': { 'max': '1535px' },
      // => @media (max-width: 1535px) { ... }

      'xl': { 'max': '1279px' },
      // => @media (max-width: 1279px) { ... }

      'lg': { 'max': '1023px' },
      // => @media (max-width: 1023px) { ... }

      'md': { 'max': '767px' },
      // => @media (max-width: 767px) { ... }

      'sm': { 'max': '639px' },
      // => @media (max-width: 639px) { ... }
    },
  },
}
