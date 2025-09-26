const spec = {
  openapi: "3.0.3",
  info: {
    title: "Oil Types API",
    version: "1.0.0",
    description: "API providing recommended oil types for engines."
  },
  components: {
    schemas: {
      Headers: {
        type: "object",
        properties: {
          type: { type: "string" },
          name: { type: "string" },
          usage: { type: "string" }
        },
        required: ["type", "name", "usage"]
      },
      OilRow: {
        type: "object",
        properties: {
          type: { type: "string" },
          name: { type: "string" },
          price: { type: "number", format: "float" },
          cylinders: { type: "integer" },
          viscosity_grade: { type: "string" }
        },
        required: ["type", "name", "price", "cylinders", "viscosity_grade"]
      },
      OilTypesData: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          shortdesc: { type: "string" },
          properties: {
            type: "object",
            properties: {
              headers: { $ref: "#/components/schemas/Headers" },
              rows: {
                type: "array",
                items: { $ref: "#/components/schemas/OilRow" }
              }
            },
            required: ["headers", "rows"]
          }
        },
        required: ["id", "title", "shortdesc", "properties"]
      }
    }
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
                schema: { $ref: "#/components/schemas/OilTypesData" },
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
                schema: { $ref: "#/components/schemas/OilRow" },
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
