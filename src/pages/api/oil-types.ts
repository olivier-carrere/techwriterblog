import type { APIRoute } from "astro";
import oilTypes from "../../data/oil-types.yaml";

export const GET: APIRoute = async () => {
  // Return the full YAML data as JSON
  return new Response(JSON.stringify(oilTypes), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
