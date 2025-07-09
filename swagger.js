import swaggerJsdoc from "swagger-jsdoc";

const BASE_URL = process.env.APP_URL || `http://localhost:3000`;

console.log(`Swagger URL: ${BASE_URL}/api-docs`);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            avatar: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 3 },
            name: { type: "string", example: "Beef" },
          },
        },
        Area: {
          type: "object",
          properties: {
            id: { type: "integer", example: 7 },
            name: { type: "string", example: "Italian" },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
          },
        },
        IngredientMeasurement: {
          type: "object",
          properties: {
            ingredient: { $ref: "#/components/schemas/Ingredient" },
            measure: { type: "string", example: "1 pound" },
          },
        },
        Recipe: {
          type: "object",
          properties: {
            id: { type: "integer", example: 101 },
            title: { type: "string", example: "Classic Beef Lasagna" },
            category: {
              $ref: "#/components/schemas/Category",
            },
            instructions: { type: "string", example: "1. Brown the beef with onions and garlic. 2. Stir in tomato sauce and seasonings..." },
            description: { type: "string", example: "A rich and cheesy homemade lasagna with a savory beef and tomato sauce." },
            image: { type: "string", example: "/uploads/recipes/lasagna.jpg" },
            time: { type: "string", example: "90 minutes" },
            owner: { $ref: "#/components/schemas/User" },
            ingredients: {
              type: "array",
              items: { $ref: "#/components/schemas/IngredientMeasurement" },
            },
            area: { $ref: "#/components/schemas/Area" },
          },
        },
        Testimonials: {
          type: "object",
          properties: {
            username: { type: "string" },
            testimonial: { type: "string" },
          },
        },
      },
    },
    info: {
      title: "Foodies API",
      version: "1.0.0",
      description: "Foodies application API documentation",
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
    tags: [
      {
        name: "Users",
        description: "Manage users",
      },
      {
        name: "Categories",
        description: "Manage categories",
      },
      {
        name: "Areas",
        description: "Manage areas",
      },
      {
        name: "Ingredients",
        description: "Manage ingredients",
      },
      {
        name: "Recipes",
        description: "Manage recipes",
      },
      {
        name: "Testimonials",
        description: "Manage testimonials",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

export const specs = swaggerJsdoc(swaggerOptions);
