import { Router } from "express";
import { EntityManager } from "typeorm";
import { createOrderController } from "../controllers/order.controller";

export const createOrderRoutes = (entityManager: EntityManager) => {
  const router = Router();

  const {
    createOrder,
    updateOrder,
    readOrders,
    deleteOrder,
    createOrderDish,
    readOrderDishes,
    deleteOrderDish,
  } = createOrderController(entityManager);

  /**
   * @swagger
   * tags:
   *   name: OrderDishes
   *   description: Operations related to order dishes
   */

  /**
   * @swagger
   * /api/orders/{orderId}/dishes/{dishId}:
   *   patch:
   *     summary: Create a new order dish
   *     description: Create a new order dish for the specified order.
   *     tags:
   *       - OrderDishes
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         description: ID of the order to which the dish belongs.
   *         schema:
   *           type: string
   *       - in: path
   *         name: dishId
   *         required: true
   *         description: ID of the dish to be added to the order.
   *         schema:
   *           type: string
   *     responses:
   *       201:
   *         description: Successful order dish creation. Returns the created order dish.
   *       400:
   *         description: Invalid or missing parameters.
   *       404:
   *         description: Order not found. Please create an order first.
   *       500:
   *         description: Internal server error.
   */
  router.patch("/:orderId/dishes/:dishId", createOrderDish);
  /**
   * @swagger
   * /api/orders/{orderId}/dishes/{orderDishIds}:
   *   get:
   *     summary: Get order dish details
   *     description: Get details of one or more order dishes by their IDs for a specific order.
   *     tags:
   *       - OrderDishes
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         description: ID of the order to which the dishes belong.
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderDishIds
   *         required: true
   *         description: IDs of the order dishes to retrieve.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful retrieval of order dishes. Returns the order dishes.
   *       400:
   *         description: Invalid or missing parameters.
   *       404:
   *         description: Order dish(es) not found.
   *       500:
   *         description: Internal server error.
   */
  router.get("/:orderId/dishes/:dishId", readOrderDishes);
  router.patch("/:orderId/dishes/:dishId/status/");
  /**
   * @swagger
   * /api/orders/{orderId}/dishes/{orderDishId}:
   *   delete:
   *     summary: Delete an order dish
   *     description: Delete an order dish by its ID for a specific order.
   *     tags:
   *       - OrderDishes
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         description: ID of the order from which the dish will be deleted.
   *         schema:
   *           type: string
   *       - in: path
   *         name: orderDishId
   *         required: true
   *         description: ID of the order dish to be deleted.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful deletion of the order dish.
   *       400:
   *         description: Invalid request. Missing parameters.
   *       404:
   *         description: Order dish(es) invalid or not found.
   *       500:
   *         description: Internal server error.
   */
  router.delete("/:orderId/dishes/:dishId", deleteOrderDish);

  router.post("/:orderId/dishes/:dishId/rating/");
  router.patch("/:orderId/dishes/:dishId/rating/:ratingId");

  /**
   * @swagger
   * tags:
   *   name: Orders
   *   description: Operations related to orders
   */
  /**
   * @swagger
   * /api/orders:
   *   post:
   *     summary: Create a new order
   *     description: Create a new order for the authenticated user.
   *     tags:
   *       - Orders
   *     responses:
   *       201:
   *         description: Successful order creation. Returns the created order.
   *       400:
   *         description: Invalid or missing parameters.
   *       401:
   *         description: Unauthorized. User not signed in or registered.
   *       500:
   *         description: Internal server error.
   */
  router.post("/", createOrder);
  /**
   * @swagger
   * /api/orders/{orderId}:
   *   get:
   *     summary: Get order details
   *     description: Get details of one or more orders by their IDs.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         description: ID of the order to retrieve.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful order retrieval. Returns order details.
   *       400:
   *         description: Invalid or missing parameters.
   *       404:
   *         description: Order(s) not found.
   *       500:
   *         description: Internal server error.
   */
  router.get("/:orderId", readOrders);
  /**
   * @swagger
   * /api/orders/{orderId}/status:
   *   patch:
   *     summary: Update next order status
   *     description: Update to the next valid status of an order. Only applicable for non-Vendor controlled statuses.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         description: ID of the order to update.
   *         schema:
   *           type: string
   *     requestBody:
   *       description: JSON object containing the updated order status.
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *
   *     responses:
   *       200:
   *         description: Successful order status update.
   *       202:
   *         description: Order is awaiting vendor action.
   *       400:
   *         description: Invalid request or cannot change status.
   *       404:
   *         description: Order not found or unauthorized.
   *       500:
   *         description: Internal server error.
   */ // TODO: Broken on swagger.
  router.patch("/:orderId/status", updateOrder);
  /**
   * @swagger
   * /api/orders/{orderId}:
   *   delete:
   *     summary: Delete an order
   *     description: Delete an order by its ID.
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: orderId
   *         required: true
   *         description: ID of the order to delete.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful order deletion.
   *       404:
   *         description: Order not found.
   *       500:
   *         description: Internal server error.
   */
  router.delete("/:orderId", deleteOrder);

  return router;
};
