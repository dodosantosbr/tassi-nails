import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true, // 👈 permite testar PWA no npm run dev
      },

      manifest: {
        name: "NailStudio Pro",
        short_name: "NailStudio",
        description: "Sistema de agendamento para Nail Designer 💅",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#e11d48",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
