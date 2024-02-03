import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        eslint(),
        checker({
            overlay: { initialIsOpen: false },
            typescript: true,
            eslint: {
                lintCommand: 'eslint --ext .js,.jsx,.ts,.tsx src',
            },
        }),
    ],
})