import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    [
      'hide-scrollbar',
      {
        overflow: 'auto',
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',
      },
    ],
  ],
})
