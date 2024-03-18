import { ConfidentialClientApplication } from "@azure/msal-node";
import { Router } from "express";
import { EntityManager } from "typeorm";
import { createAuthController } from "../controllers/auth.controller";

export const createAuthRoutes = (
  entityManager: EntityManager,
  confidentialClientAuth: ConfidentialClientApplication
) => {
  const router = Router();

  const { register, authCallbackRegister, login, authCallback, logout } =
    createAuthController(entityManager, confidentialClientAuth);

  router.use("/register", register);
  router.use("/callback-register", authCallbackRegister);
  router.use("/login", login);
  router.use("/logout", logout);
  router.use("/callback", authCallback);

  return router;
};
