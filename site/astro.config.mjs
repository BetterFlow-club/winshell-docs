import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// SITE / BASE come from the deploy (GitHub Pages sets them in CI).
export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE,
  integrations: [
    starlight({
      title: "winshell",
      description: "A programmable shell for Windows: bars, popups and widgets as web pages.",
      customCss: ["./src/styles/custom.css"],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/BetterFlow-club/winshell" }],
      editLink: { baseUrl: "https://github.com/BetterFlow-club/winshell-docs/edit/main/site/" },
      sidebar: [
        { label: "Start", items: ["start/install", "start/winshellctl", "start/troubleshooting"] },
        { label: "Configure", items: ["config/overview", "config/hotkeys", "config/surfaces", "config/reference"] },
        {
          label: "Build a shell",
          items: ["shells/quickstart", "shells/surfaces", "shells/sdk", "shells/recipes", "shells/topics", "shells/protocol"],
        },
        { label: "AI", items: ["ai/mcp"] },
      ],
    }),
  ],
});
