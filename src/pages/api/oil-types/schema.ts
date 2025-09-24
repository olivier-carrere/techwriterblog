import type { APIRoute } from "astro";
import yaml from "js-yaml";
import oilTypes from "../../../data/oil-types.yaml";

export const GET: APIRoute = async ({ request }) => {
  // Base OpenAPI spec
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Oil Types API",
      version: "1.0.0",
      description: "API providing recommended oil types for engines."
    },
    paths: {
      "/api/oil-types": {
        get: {
          summary: "Get all oil types",
          responses: {
            "200": {
              description: "Full oil types data",
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: oilTypes
                }
              }
            }
          }
        }
      },
      "/api/oil-types/{index}": {
        get: {
          summary: "Get single oil type",
          parameters: [
            {
              name: "index",
              in: "path",
              required: true,
              schema: { type: "integer", minimum: 0 }
            }
          ],
          responses: {
            "200": {
              description: "Single oil type row",
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: oilTypes.properties.rows[0]
                }
              }
            },
            "404": {
              description: "Row not found",
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: { error: "Not found" }
                }
              }
            }
          }
        }
      }
    }
  };

  // Detect Accept header
  const accept = request.headers.get("Accept") || "";
  if (accept.includes("application/yaml") || accept.includes("text/yaml")) {
    return new Response(yaml.dump(spec), {
      status: 200,
      headers: { "Content-Type": "application/x-yaml" }
    });
  }

  // Default to JSON
  return new Response(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
