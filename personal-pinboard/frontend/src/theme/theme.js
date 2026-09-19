import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brandRed',
  colors: {
    // Custom brand red palette with signature #e60023
    brandRed: [
      '#fff1f2', // 0: lightest tint for backgrounds/badges
      '#ffe4e6', // 1: soft hover background
      '#fecdd3', // 2: subtle borders
      '#fda4af', // 3: lighter accents
      '#fb7185', // 4
      '#f43f5e', // 5: light red
      '#e60023', // 6: primary brand red
      '#be123c', // 7: active / pressed
      '#9f1239', // 8: dark red
      '#881337', // 9: darkest red
    ],
  },
  fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
  cursorType: 'pointer',
  components: {
    Button: {
      defaultProps: {
        color: 'brandRed',
        radius: 'xl',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});
