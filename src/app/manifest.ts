import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.slogan,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f1",
    theme_color: "#0b450b",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/images/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
