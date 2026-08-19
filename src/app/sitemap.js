const SITE_URL = "https://jeonse.ourcalctools.com";

export default function sitemap() {
  const routes = ["", "/checklist", "/glossary"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
