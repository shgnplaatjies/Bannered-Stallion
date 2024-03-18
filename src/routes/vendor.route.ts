import { Router } from "express";
import { EntityManager } from "typeorm";
import { createVendorController } from "../controllers/vendor.controller";

export const createVendorRoutes = (entityManager: EntityManager) => {
  const router = Router();

  const {
    createVendor,
    readVendors,
    updateVendor,
    deleteVendor,
    createVendorDish,
    readVendorDishes,
    updateVendorDish,
    deleteVendorDish,
    readVendorOrderDishes,
    updateVendorOrderDish,
    deleteVendorOrderDish,
  } = createVendorController(entityManager);

  /**
   * @swagger
   * tags:
   *   name: VendorDish
   *   description: Operations related to vendor dishes
   */
  /**
   * @swagger
   * /api/vendor/{vendorId}/dishes:
   *   post:
   *     summary: Create a new vendor dish
   *     tags: [VendorDish]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *     responses:
   *       201:
   *         description: Vendor dish created successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Vendor not found or dish creation failed
   *       500:
   *         description: Internal server error
   */
  router.post("/:vendorId/dishes/", createVendorDish);
  /**
   * @swagger
   * /api/vendor/{vendorId}/dishes/{dishId}:
   *   get:
   *     summary: Retrieve a list of vendor dishes
   *     tags: [VendorDish]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *       - in: path
   *         name: dishId
   *         schema:
   *           type: number | number[]
   *         description: Vendor ID
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Vendor or dishes not found
   *       500:
   *         description: Internal server error
   */
  router.get("/:vendorId/dishes/:dishId", readVendorDishes);
  /**
   * @swagger
   * /api/vendor/{vendorId}/dishes/{dishId}:
   *   patch:
   *     summary: Update a vendor dish by ID
   *     tags: [VendorDish]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *       - in: path
   *         name: dishId
   *         schema:
   *           type: string
   *         description: Dish ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               price:
   *                 type: number
   *     responses:
   *       200:
   *         description: Vendor dish updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Vendor or dish not found
   *       500:
   *         description: Internal server error
   */

  router.patch("/:vendorId/dishes/:dishId", updateVendorDish);
  /**
   * @swagger
   * /api/vendor/{vendorId}/dishes/{dishId}:
   *   delete:
   *     summary: Delete a vendor dish by ID
   *     tags: [VendorDish]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *       - in: path
   *         name: dishId
   *         schema:
   *           type: string
   *         description: Dish ID
   *     responses:
   *       200:
   *         description: Vendor dish deleted successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Vendor or dish not found
   *       500:
   *         description: Internal server error
   */
  router.delete("/:vendorId/dishes/:dishId", deleteVendorDish);

  router.get("/:vendorId/orderDish/", readVendorOrderDishes);
  router.patch("/:vendorId/orderDish/:orderDishId", updateVendorOrderDish);
  router.delete("/:vendorId/orderDish/:orderDishId", deleteVendorOrderDish);

  /**
   * @swagger
   * tags:
   *   name: Vendor
   *   description: Operations related to vendors
   */
  /**
   * @swagger
   * /api/vendor:
   *   post:
   *     summary: Create a new vendor
   *     tags:
   *       - Vendor
   *     requestBody:
   *       description: Vendor details
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       201:
   *         description: Vendor created successfully
   *       400:
   *         description: Bad request
   *       409:
   *         description: Duplicate entry. Only one store allowed per user.
   *       500:
   *         description: Internal server error
   */
  router.post("/", createVendor);
  /**
   * @swagger
   * /api/vendor/{vendorId}:
   *   get:
   *     summary: Retrieve a list of vendors
   *     tags: [Vendor]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *     responses:
   *       200:
   *         description: Successful response
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Vendor not found
   *       500:
   *         description: Internal server error
   */
  router.get("/:vendorId", readVendors);
  /**
   * @swagger
   * /api/vendor/{vendorId}:
   *   patch:
   *     summary: Update vendor information
   *     tags: [Vendor]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Vendor information updated successfully
   *       400:
   *         description: Invalid request
   *       401:
   *         description: Unauthorized user
   *       500:
   *         description: Internal server error
   */
  router.patch("/:vendorId", updateVendor);
  /**
   * @swagger
   * /api/vendor/{vendorId}:
   *   delete:
   *     summary: Delete a vendor by ID
   *     tags: [Vendor]
   *     parameters:
   *       - in: path
   *         name: vendorId
   *         schema:
   *           type: string
   *         description: Vendor ID
   *     responses:
   *       200:
   *         description: Vendor deleted successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Vendor not found
   *       500:
   *         description: Internal server error
   */
  router.delete("/:vendorId", deleteVendor);

  return router;
};
