import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { EntityManager } from "typeorm";
import { swaggerConfig } from "../services/config/swagger.config";
import { createOrderRoutes } from "./order.routes";
import { createUserRoutes } from "./user.routes";
import { createVendorRoutes } from "./vendor.route";

export const createAppRoutes = (entityManager: EntityManager) => {
  const router = Router();

  const swag = swaggerJSDoc(swaggerConfig);
  const orderRoutes = createOrderRoutes(entityManager);
  const userRoutes = createUserRoutes(entityManager);
  const vendorRoutes = createVendorRoutes(entityManager);

  router.use("/docs", serve, setup(swag));
  router.use("/orders", orderRoutes);
  router.use("/user", userRoutes);
  router.use("/vendor", vendorRoutes);

  return router;
};
