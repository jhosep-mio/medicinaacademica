export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#041E40',
        main: '#D23741',
        form: '#fff',
        secondary: {
          10: '#637A9D',
          50: '#0B7AC3',
          70: '#22ACFF',
          100: '#094173',
          150: '#6F92BF',
          200: '#0bd4c1',
          900: '#B5C2CA'
        },
        main_2: {
          100: '#fff',
          150: '#F9FAFB',
          250: '#E9E9E9',
          200: '#906B9F',
          900: '#131517'
        }
      }
    }
  },
  plugins: []
}
