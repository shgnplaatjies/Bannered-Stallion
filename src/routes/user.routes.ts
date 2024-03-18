import { Router } from "express";
import { EntityManager } from "typeorm";
import { createUserController } from "../controllers/user.controller";

export const createUserRoutes = (entityManager: EntityManager) => {
  const router = Router();

  const { deleteUser, readUser, updateUser, updateRole, readRole } =
    createUserController(entityManager);

  /**
   * @swagger
   * tags:
   *   name: User
   *   description: Operations related to users
   */

  /**
   * @swagger
   * /api/user:
   *   get:
   *     summary: Retrieve user information
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Successful response
   *       401:
   *         description: Unauthorized user
   *       500:
   *         description: Internal server error
   */
  router.get("/", readUser);
  /**
   * @swagger
   * /api/user:
   *   patch:
   *     summary: Update user information
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               roleId:
   *                 type: number
   *     responses:
   *       200:
   *         description: User information updated successfully
   *       400:
   *         description: Invalid request
   *       401:
   *         description: Unauthorized user
   *       500:
   *         description: Internal server error
   */
  router.patch("/", updateUser);
  /**
   * @swagger
   * /api/user:
   *   delete:
   *     summary: Delete user
   *     tags: [User]
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       401:
   *         description: Unauthorized user
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  router.delete("/", deleteUser);

  /**
   * @swagger
   * /api/user/role/{roleId}:
   *   patch:
   *     summary: Update user role
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: roleId
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: User role updated successfully
   *       400:
   *         description: Invalid request or roleId
   *       401:
   *         description: Unauthorized user
   *       409:
   *         description: Conflict - User already has the requested role
   *       500:
   *         description: Internal server error
   */
  router.patch("/role/:roleId", updateRole);
  /**
   * @swagger
   * /api/user/role:
   *   get:
   *     summary: Retrieve current user's role information
   *     tags: [User]
   *     responses:
   *       200:
   *         description: Successful response
   *       401:
   *         description: Unauthorized current user's role
   *       500:
   *         description: Internal server error
   */
  router.get("/role", readRole);

  return router;
};
