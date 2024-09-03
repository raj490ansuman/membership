module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#99CA29',
        secondary: '#21acd7',
        line: '#06C755',
        'custom-green': '#8ac926',
        'custom-light-green': '#fcfff0',
        'custom-red': '#ff595e',
        'custom-light-red': '#fff2f0',
        'custom-gray': '#d9d9d9',
        'custom-yellow': '#FAD717',
        'custom-light-yellow': '#FEFBE8',
        'custom-campaign': '#960E0E',
      },
      zIndex: {
        '-1': '-1',
      },
      scale: {
        flip: '-1',
      },
      lineHeight: {
        0: '0',
      },
      fontSize: {
        xxs: '.70rem',
      },
      height: {
        18: '4.5rem',
      },
    },
    fontFamily: {
      sans: [
        'Noto Sans JP',
        '游ゴシック',
        '游ゴシック体',
        'YuGothic',
        'Yu Gothic',
        'メイリオ',
        'Meiryo',
        'ＭＳ ゴシック',
        'MS Gothic',
        'HiraKakuProN-W3',
        'TakaoExゴシック',
        'TakaoExGothic',
        'MotoyaLCedar',
        'Droid Sans Japanese',
        'sans-serif',
      ],
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
    }),
    textColor: (theme) => ({
      ...theme('colors'),
    }),
    borderColor: (theme) => ({
      ...theme('colors'),
    }),
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    fontFamily: false,
    preflight: false,
  },
  plugins: [],
  important: true,
}
