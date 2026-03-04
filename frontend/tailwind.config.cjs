module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DE5200',
        secondary: '#FFFFFF',
        text: '#3F414A',
        borderLight: '#F4F4F4',
        borderLighter: '#EDEDED',
      },
      borderRadius: {
        card: '12px',
        modal: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        modal: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
