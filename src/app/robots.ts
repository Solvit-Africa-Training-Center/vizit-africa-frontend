import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vizit.africa";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profile/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
