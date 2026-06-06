/** */
export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const TAG_DISPLAY_OVERRIDE = {
  "ai": "AI",
  "api": "API",
  "deepl": "DeepL",
  "dita": "DITA",
  "docs-as-code": "Docs-as-Code",
  "gpt-4o": "GPT-4o",
  "html": "HTML",
  "latex": "LaTeX",
  "openapi": "OpenAPI",
  "seo": "SEO",
  "ux": "UX",
  "ux-writing": "UX Writing",
  "wordpress": "WordPress",
  "xml": "XML",
  "yaml": "YAML",
};

export function formatTagDisplay(slug) {
  if (TAG_DISPLAY_OVERRIDE[slug]) return TAG_DISPLAY_OVERRIDE[slug];
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function tagSlug(rawTag) {
  return rawTag.toLowerCase().replace(/\s+/g, "-");
}
