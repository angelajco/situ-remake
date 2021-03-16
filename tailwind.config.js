module.exports = {
  important: true,
  prefix: 'tw-',
  purge: ['./pages/**/*.js', './components/**/*.js'],
  theme: {
    fontFamily: {
      'sans': 'Montserrat, sans-serif'
    },
    extend: {
      colors: {
        'titulo': '#276C6F',
        'menu': '#65A79F',
        inst: {
          'crema': '#ddc9a3',
          'dorado': '#bc955c',
          'guinda': '#691c32',
          'rojo': '#9f2241',
          'grisc': '#98989a',
          'grisf': '#6f7271',
          "verdec": "#325b4e",
          "verdef": "#10312b"
        },
        guia: {
          "grisf6": "#f6f6f6",
          "grisdd": "#dddddd",
          'gris54': '#545454'
        }
      }
    },
    screens: {
      'xl': { 'min': '1201px' },
      // => @media (max-width: 1279px) { ... }

      'lg': { 'max': '1200.5px' },
      // => @media (max-width: 1023px) { ... }

      'md': { 'max': '991.5px' },
      // => @media (max-width: 767px) { ... }

      'sm': { 'max': '768.5px' },
      // => @media (max-width: 639px) { ... }
    },
  },
}
