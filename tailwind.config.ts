import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{vue,ts,js}', './server/**/*.ts'],
  theme: {
    extend: {
      colors: {
        hana: {
          dark: '#22031f',
          red: '#ff3131',
        },
      },
      backgroundImage: {
        'hana-gradient': 'linear-gradient(135deg, #22031f 0%, #ff3131 100%)',
      },
    },
  },
} satisfies Config;
