import { SITE_URL } from "./site";

export const dynamic = "force-static";

export default async function sitemap() {
  return ["", "/news", "/publications", "/experience"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));
}
