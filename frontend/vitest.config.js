/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import react from "@vitejs/plugin-react";
console.log("Loaded vitest config");
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./__tests__/setupTest.js",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/"),
            // components: `${path.resolve(__dirname, "./src/components/")}`,
            components: path.resolve(__dirname, "./src/components/"),
            // public: `${path.resolve(__dirname, "./public/")}`,
            public: path.resolve(__dirname, "./public/"),
            pages: path.resolve(__dirname, "./src/pages/"),
            types: path.resolve(__dirname, "./src/types/"),
            // types: `${path.resolve(__dirname, "./src/types/")}`,
        },
    },
});
