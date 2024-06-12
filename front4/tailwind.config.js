// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Tailwind CSS가 사용될 파일들을 지정
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main-image': "url('/src/img/backImage.jpg')",
      },

    },
  },
  plugins: [],
}
