import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#000000',
          secondary: '#0B0B0B',
          tertiary: '#29292A',
        },
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.5)',
          tertiary: 'rgba(255, 255, 255, 0.4)',
        },
        border: {
          primary: 'rgba(255, 255, 255, 0.2)',
          secondary: 'rgba(255, 255, 255, 0.07)',
          dark: '#141414',
          darker: '#171717',
        },
        accent: {
          purple: '#C53DFF',
          green: '#75FB63',
          blue: '#638EFB',
        },
        overlay: {
          glass: 'rgba(255, 255, 255, 0.14)',
          'dark-glass': 'rgba(0, 0, 0, 0.01)',
          tag: 'rgba(233, 233, 233, 0.12)',
          input: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        berka: ['Berka', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
      },
      fontSize: {
        // Fluid typography with mobile-first approach
        h1: ['clamp(2.1875rem, 2rem + 2vw, 3.4375rem)', { lineHeight: '1.1', letterSpacing: '0' }],  // 35px → 55px
        h2: ['clamp(1.5625rem, 1.5rem + 1vw, 2.1875rem)', { lineHeight: '1.25', letterSpacing: '0' }],  // 25px → 35px
        h3: ['clamp(1.25rem, 1.125rem + 0.5vw, 1.5625rem)', { lineHeight: '1.2', letterSpacing: '0' }],  // 20px → 25px
        h4: ['clamp(1.125rem, 1.0625rem + 0.25vw, 1.25rem)', { lineHeight: '1.3', letterSpacing: '0' }],  // 18px → 20px
        body: ['clamp(0.875rem, 0.8438rem + 0.125vw, 0.9375rem)', { lineHeight: '1.7', letterSpacing: '0' }],  // 14px → 15px
        'body-bold': ['clamp(0.875rem, 0.8438rem + 0.125vw, 0.9375rem)', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
        caption: ['clamp(0.75rem, 0.7188rem + 0.125vw, 0.8125rem)', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],  // 12px → 13px
      },
      spacing: {
        // Fixed spacing values
        '0.125': '0.125rem',    // 2px
        '0.3125': '0.3125rem',  // 5px
        '0.4375': '0.4375rem',  // 7px
        '0.625': '0.625rem',    // 10px
        '0.75': '0.75rem',      // 12px
        '0.9375': '0.9375rem',  // 15px
        '1': '1rem',            // 16px
        '1.25': '1.25rem',      // 20px
        '1.5625': '1.5625rem',  // 25px
        '1.875': '1.875rem',    // 30px
        '2': '2rem',            // 32px
        '2.1875': '2.1875rem',  // 35px
        '2.5': '2.5rem',        // 40px
        '3': '3rem',            // 48px
        '3.125': '3.125rem',    // 50px
        '3.75': '3.75rem',      // 60px
        '4': '4rem',            // 64px
        '4.375': '4.375rem',    // 70px
        '6.25': '6.25rem',      // 100px
        '7.8125': '7.8125rem',  // 125px
        '10.9375': '10.9375rem', // 175px
        '17.125': '17.125rem',  // 274px
        '22.5625': '22.5625rem', // 361px
        '35.25': '35.25rem',    // 564px
        '37.5': '37.5rem',      // 600px
        '49.125': '49.125rem',  // 786px
        '77.5': '77.5rem',      // 1240px
        '90': '90rem',          // 1440px
        
        // Fluid spacing values using clamp()
        'fluid-xs': 'clamp(0.625rem, 2vw, 1.25rem)',      // 10px → 20px
        'fluid-sm': 'clamp(1.25rem, 3vw, 3.125rem)',      // 20px → 50px
        'fluid-md': 'clamp(1.875rem, 4vw, 3.75rem)',      // 30px → 60px
        'fluid-lg': 'clamp(3.125rem, 6vw, 6.25rem)',      // 50px → 100px
        'fluid-xl': 'clamp(6.25rem, 8vw, 10.9375rem)',    // 100px → 175px
      },
      gap: {
        // Fluid gap values
        'fluid-xs': 'clamp(0.625rem, 2vw, 1.25rem)',      // 10px → 20px
        'fluid-sm': 'clamp(1.25rem, 3vw, 1.5625rem)',     // 20px → 25px
        'fluid-md': 'clamp(1.5625rem, 3vw, 3.125rem)',    // 25px → 50px
        'fluid-lg': 'clamp(3.125rem, 5vw, 6.25rem)',      // 50px → 100px
      },
      padding: {
        // Fluid padding values
        'fluid-container': 'clamp(1.25rem, 5vw, 6.25rem)',  // 20px → 100px
        'fluid-section': 'clamp(3.125rem, 6vw, 6.25rem)',   // 50px → 100px
      },
      height: {
        // Component heights
        'header-mobile': '3.125rem',   // 50px
        'header-tablet': '4rem',       // 64px
        'header-desktop': '4.375rem',  // 70px
        'hero-mobile': '37.5rem',      // 600px
        'hero-tablet': '42.5rem',      // 680px
        'hero-desktop': '49.125rem',   // 786px
        'input': '3.75rem',            // 60px
        'button': '3rem',              // 48px
        'tag': '2.25rem',              // 36px
        'touch-target': '2.75rem',     // 44px minimum
      },
      minHeight: {
        'touch-target': '2.75rem',     // 44px minimum
        'service-card': '17.125rem',   // 274px
        'service-card-audit': '35.25rem', // 564px
      },
      minWidth: {
        'touch-target': '2.75rem',     // 44px minimum
      },
      borderRadius: {
        '0.375': '0.375rem',  // 6px
        '0.5': '0.5rem',      // 8px
        '1.25': '1.25rem',    // 20px
      },
      backdropBlur: {
        '2': '2px',
        '5': '5px',
        '7.5': '7.5px',
      },
      boxShadow: {
        'map': [
          '0px 0px 0px 1.592px rgba(0,0,0,0.2)',
          '0px 0px 3.185px 0px rgba(0,0,0,0.08)',
          '0px 3.185px 9.554px 0px rgba(0,0,0,0.1)',
        ].join(', '),
        'card-hover': '0 1rem 2rem rgba(197, 61, 255, 0.2)',
      },
      maxWidth: {
        container: '90rem',   // 1440px
        content: '77.5rem',   // 1240px
        'prose': '65ch',      // Optimal reading width
      },
      screens: {
        'xs': '320px',   // Minimum mobile
        'sm': '640px',   // Mobile landscape
        'md': '768px',   // Tablet portrait
        'lg': '1024px',  // Tablet landscape / Small laptop
        'xl': '1280px',  // Desktop
        '2xl': '1440px', // Large desktop
      },
      gridTemplateColumns: {
        // Responsive grid patterns
        'auto-fit-sm': 'repeat(auto-fit, minmax(min(18rem, 100%), 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(min(20rem, 100%), 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(min(23rem, 100%), 1fr))',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-mobile': 'marquee 15s linear infinite',
      },
    },
  },
  plugins: [
    // Custom utilities plugin
    plugin(function({ addUtilities, addComponents, theme }) {
      // Fluid container utilities
      addComponents({
        '.container-fluid': {
          width: '100%',
          maxWidth: theme('maxWidth.container'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1.25rem, 5vw, 6.25rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 6.25rem)',
        },
        '.container-content': {
          width: '100%',
          maxWidth: theme('maxWidth.content'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(1.25rem, 5vw, 6.25rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 6.25rem)',
        },
      });

      // Touch target utilities
      addUtilities({
        '.touch-target': {
          minWidth: theme('minWidth.touch-target'),
          minHeight: theme('minHeight.touch-target'),
        },
      });

      // Scrollbar hide utilities
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });

      // Fluid height utilities
      addUtilities({
        '.h-header-fluid': {
          height: 'clamp(3.125rem, 4rem, 4.375rem)',  // 50px → 64px → 70px
        },
        '.h-hero-fluid': {
          height: 'clamp(40.625rem, 100vh, 56.25rem)',  // 650px → 100vh → 900px
          minHeight: '40.625rem',  // Minimum 650px
          maxHeight: '56.25rem',  // Maximum 900px
        },
      });

      // Grid utilities for responsive layouts
      addUtilities({
        '.grid-responsive-1-2-3': {
          display: 'grid',
          gridTemplateColumns: '1fr',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
        },
        '.grid-responsive-1-2-4': {
          display: 'grid',
          gridTemplateColumns: '1fr',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          },
        },
      });

      // Disable hover on touch devices
      addUtilities({
        '@media (hover: none)': {
          '.hover-none-touch:hover': {
            transform: 'none',
            boxShadow: 'none',
          },
        },
      });
    }),
  ],
};

export default config;
