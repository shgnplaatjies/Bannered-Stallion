import { Options } from "swagger-jsdoc";

export const swaggerConfig: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "The Prancing Pony API",
      version: "1.0.0",
      description: "A restuarant API for the Prancing Pony",
    },
  },
  apis: [`src/routes/*.ts`],
};
