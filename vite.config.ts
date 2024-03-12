import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
//        checker({
//            overlay: { initialIsOpen: false },
//            typescript: true,
//            eslint: {
//                lintCommand: "eslint --ext .js,.jsx,.ts,.tsx src",
 //           },
 //       }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
