const { fontFamily, fontSize } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontSize: {
      heading1: ['24px', { lineHeight: '32px', letterSpacing: '0.02em' }],
      heading2: ['20px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      heading3: ['18px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      heading4: ['16px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      heading5: ['14px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      heading6: ['12px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      body1: ['16px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      body2: ['14px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      body3: ['12px', { lineHeight: '24px', letterSpacing: '0.02em' }],
      body4: ['10px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      ...fontSize,
    },
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
    extend: {
      fontFamily: {
        sans: ['"Avenir Book"', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
