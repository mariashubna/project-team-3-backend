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