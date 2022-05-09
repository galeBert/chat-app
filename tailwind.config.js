const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: '#FFFFFF',
      primary: {
        100: '#7F57FF',
        300: '#724EE6',
        600: '#6646CC',
      },
      red: {
        100: '#FF0073',
        300: '#E60068',
        600: '#CC005C',
      },
      yellow: {
        100: '#F6C059',
        300: '#DDAD50',
        600: '#C59A47',
      },
      green: {
        300: '#2FDD92',
      },
      blue: {
        100: '#307BF4',
        300: '#2B6FDC',
        600: '#2662C3',
      },
      dark: {
        50: '#493F4D',
        100: '#46374C',
        300: '#392D3E',
        600: '#2A222E',
      },
      gray: {
        100: '#FAFAFA',
        300: '#E6E6E6',
        600: '#6E6E6E',
        900: '#585858',
      },
      twitter: {
        100: '#2DAAE1',
        300: '#2999CB',
        600: '#2488B4',
      },
    },
    fontFamily: {
      sans: ['"Avenir-Book"', ...fontFamily.sans],
    },
    extend: {
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      },
      fontSize: {
        vxs: '10px',
      },
      padding: {
        0.5: '2px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
