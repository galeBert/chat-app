const { fontFamily, fontSize } = require('tailwindcss/defaultTheme');

// This function let us to get the opacity color of our customize color. Refer to this link https://tailwindcss.com/docs/customizing-colors#using-css-variables
function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

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
      brand: {
        1: withOpacityValue('--tw-color-brand-1'),
        2: withOpacityValue('--tw-color-brand-2'),
      },
      typography: {
        1: withOpacityValue('--tw-color-typography-1'),
        2: withOpacityValue('--tw-color-typography-2'),
        3: withOpacityValue('--tw-color-typography-3'),
      },
      light: {
        1: withOpacityValue('--tw-color-light-1'),
        2: withOpacityValue('--tw-color-light-2'),
        3: withOpacityValue('--tw-color-light-3'),
        4: withOpacityValue('--tw-color-light-4'),
        5: withOpacityValue('--tw-color-light-5'),
        6: withOpacityValue('--tw-color-light-6'),
        7: withOpacityValue('--tw-color-light-7'),
        8: withOpacityValue('--tw-color-light-8'),
      },
      dark: {
        1: withOpacityValue('--tw-color-dark-1'),
        2: withOpacityValue('--tw-color-dark-2'),
        3: withOpacityValue('--tw-color-dark-3'),
        4: withOpacityValue('--tw-color-dark-4'),
        5: withOpacityValue('--tw-color-dark-5'),
        6: withOpacityValue('--tw-color-dark-6'),
        7: withOpacityValue('--tw-color-dark-7'),
      },
      status: {
        1: withOpacityValue('--tw-color-status-1'),
        2: withOpacityValue('--tw-color-status-2'),
        3: withOpacityValue('--tw-color-status-3'),
        4: withOpacityValue('--tw-color-status-4'),
        5: withOpacityValue('--tw-color-status-5'),
        6: withOpacityValue('--tw-color-status-6'),
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
