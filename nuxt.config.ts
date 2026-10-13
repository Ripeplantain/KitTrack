import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "shadcn-nuxt"],
  shadcn: {
    prefix: "",
    componentDir: "@/components/ui",
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? "",
    databaseUrlUnpooled: process.env.DATABASE_URL_UNPOOLED ?? "",
    neonBranch: process.env.NEON_BRANCH ?? "",
    betterAuthSecret: process.env.BETTER_AUTH_SECRET ?? "",
    public: {
      appName: "KitTrack",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
