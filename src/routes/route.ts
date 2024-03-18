import { ConfidentialClientApplication } from "@azure/msal-node";
import { Router } from "express";
import { DataSource } from "typeorm";
import { createController } from "../controllers/controller";
import { createAuthMiddleware } from "../middleware/auth.middleware";
import { getOrmConnectionOptions } from "../services/config/orm.config";
import { handleError } from "../services/utils/error.service";
import { populateDatabaseStaticTables } from "../services/utils/seeder.service";
import { createAppRoutes } from "./app.route";
import { createAuthRoutes } from "./auth.route";

export const createRoutes = async (
  confidentialClientAuth: ConfidentialClientApplication
) => {
  const router = Router();
  const dataSource = new DataSource(getOrmConnectionOptions());

  await dataSource.initialize().catch((error) => {
    handleError(error, "Database initialization failed.\nAborting...");
    throw error;
  });

  try {
    await populateDatabaseStaticTables(dataSource.manager);
  } catch (error) {
    handleError(new Error(String(error)), "Database population failed");
  }

  const { pageNotFound } = createController();

  const authRoutes = createAuthRoutes(
    dataSource.manager,
    confidentialClientAuth
  );

  const { guard } = createAuthMiddleware(confidentialClientAuth);

  const appRoutes = createAppRoutes(dataSource.manager);

  router.use("/auth", authRoutes);

  router.use("/api", guard, appRoutes);

  router.use(pageNotFound);

  return router;
};
