import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import dts from "vite-plugin-dts";

function copyDir(srcDir: string, destDir: string) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function copyStylesPlugin(): Plugin {
  return {
    name: "copy-styles",
    apply: "build",
    closeBundle() {
      const src = path.resolve(__dirname, "src/styles");
      const dest = path.resolve(__dirname, "dist/styles");
      copyDir(src, dest);
    },
  };
}

function createViteConfig() {
  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      copyStylesPlugin(),
      dts({ rollupTypes: true }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      lib: {
        entry: "./src/index.ts",
        name: "BobObringerDesignSystem",
        fileName: () => "index.esm.js",
        formats: ["es"],
      },
      rollupOptions: {
        external: [
          "react",
          "react-dom",
          "react/jsx-runtime",
          "react-dom/client",
          /^react\/.*/,
        ],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "react/jsx-runtime": "jsx",
          },
          banner: () => '"use client";\n',
        },
        watch: {
          include: ["src/**/*"],
        },
      },
    },
  });
}

export default createViteConfig();
