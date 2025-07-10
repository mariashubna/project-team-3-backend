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
            id: { type: "integer", example: 6 },
            name: { type: "string", example: "Dessert" },
          },
        },
        Area: {
          type: "object",
          properties: {
            id: { type: "integer", example: 7 },
            name: { type: "string", example: "British" },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            id: { type: "integer", example: 273 },
            name: { type: "string", example: "Unsalted Butter" },
            description: { type: "string", example: "Butter made from cream that has been separated from milk and churned, without any added salt" },
            image: { type: "string", example: "https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e3828.png" },
          },
        },
        IngredientMeasurement: {
          type: "object",
          properties: {
            id: { type: "string", example: "273" },
            measure: { type: "string", example: "175g" },
          },
        },
        Recipe: {
          type: "object",
          properties: {
            id: { type: "integer", example: 287 },
            title: { type: "string", example: "Ukrainian Borscht" },
            categoryId: { type: "integer", example: 10 },
            areaId: { type: "integer", example: 1 },
            instructions: { type: "string", example: "1. Boil a meat broth. 2. Prepare vegetables: cut cabbage, grate beets, cut celery. 3. Sauté celery. 4. Add all ingredients to the broth and cook until tender. 5. Serve with sour cream and green onions." },
            description: { type: "string", example: "Traditional Ukrainian borscht with cabbage and beets" },
            thumb: { type: "string", example: "/temp/1752106308896_199096356_receipt1.jpg" },
            time: { type: "string", example: "120" },
            owner: { type: "integer", example: 5 },
            createdAt: { type: "string", example: "2025-07-10T00:11:49.086Z" },
            updatedAt: { type: "string", example: "2025-07-10T00:11:49.086Z" },
          },
        },
        Testimonials: {
          type: "object",
          properties: {
            username: { type: "string" },
            testimonial: { type: "string" },
          },
        },
        Error: {
          type: "object", 
          properties: {
            message: { type: "string" },
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
