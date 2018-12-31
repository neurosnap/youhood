export default {
  palette: {
    success: '#5fba7d',
    error: 'rgb(244,154,194)',
    font: {
      primary: '#fff',
      input: '#495057',
      error: '#721c24',
      disabled: '#ccc',
    },
    bg: {
      primary: '#4285f4',
      secondary: '#fff',
      error: '#f8d7da',
      accent: '#37404e',
      input: {
        hover: 'rgba(255, 255, 255, 0.25)',
        normal: 'rgba(255, 255, 255, 0.15)',
      },
    },
    hood: {
      primary: 'rgb(154,194,244)',
      selected: 'rgb(204, 154, 244)',
      hover: 'rgb(194, 244, 154)',
    },
  },
  font: {
    size: {
      small: '0.8rem',
      normal: '1rem',
      large: '1.1rem',
      header: {
        small: '1.2rem',
        large: '1.3rem',
        xlarge: '2rem',
        xxlarge: '2.5rem',
      },
    },
  },
  responsive: {
    mobile: (strings: TemplateStringsArray, ...args: any[]) => {
      return `@media only screen and (max-width: 760px) {
        ${strings.join('')}
      }`;
    },
  },
};
