/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {

        inter: ['Inter-Regular', 'sans-serif'],
        interBold: ['Inter-Bold', 'sans-serif'],
        interSemiBold: ['Inter-SemiBold', 'sans-serif'],
        interMedium: ['Inter-Medium', 'sans-serif'],
        interThin: ['Inter-Thin', 'sans-serif'],
        interExtraBold: ['Inter-ExtraBold', 'sans-serif'],
        interBlack: ['Inter-Black', 'sans-serif'],
        interLight: ['Inter-Light', 'sans-serif'],
      },
      colors:{
        primary: '#030014',
        secondary: '#151312',
        light: {
          100: '#D6C6FF',
          200: '#A8BFDB',
          300: '#9CA4AB'
        },
        dark: {
          100: '#221f3d',
          200: '#0d0d23',
          
        },
        accent: '#AB8BFF'
      }

    },
  },
  plugins: [],
}
