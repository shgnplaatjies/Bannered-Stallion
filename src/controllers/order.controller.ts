import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { EntityManager, In, Not } from "typeorm";
import { Dish } from "../models/Dish.entity";
import { Order } from "../models/Order.entity";
import { OrderDish } from "../models/OrderDish.entity";
import { OrderDishStatus } from "../models/OrderDishStatus.entity";
import { OrderStatus } from "../models/OrderStatus.entity";
import { User } from "../models/User.entity";
import { CustomSessionData } from "../services/types/interface";
import { handleError } from "../services/utils/error.service";
import { transactionWrapper } from "../services/utils/transaction.service";
import {
  convertToArray,
  findNextStatus,
} from "../services/utils/utils.service";

export const createOrderController = (entityManager: EntityManager) => {
  const createOrder = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const user = await manager.findOne(User, {
          where: { sub: sub },
        });

        if (!user)
          return res
            .status(401)
            .send("Unauthorized. Please sign in or register.");

        const [defaultStatus] = await manager.find(OrderStatus);

        if (!defaultStatus)
          return res.status(500).send("No order statuses found in datasource.");

        const order = new Order(user, defaultStatus);

        await manager.save(order);

        return res.status(201).send(order);
      });
    } catch (error) {
      return handleError(
        new Error(String(error)),
        "Create dish operation failed",
        {
          req,
          res,
          status: 500,
        }
      );
    }
  };

  const readOrders = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { orderId } = req.params;

    const arrayOrderId = convertToArray(orderId);

    if (!arrayOrderId)
      return res.status(400).send("Invalid or missing orderId parameter");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const orders = await manager.find(Order, {
          where: {
            user: { sub: sub },
            id: In(arrayOrderId),
          },
        });

        if (!orders || orders.length === 0)
          return res.status(404).send("Order(s) not found");

        return res.status(200).json(orders);
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error viewing order: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const updateOrder = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { orderId } = req.params;

    if (!orderId)
      return res
        .status(400)
        .send("Invalid request, missing orderId url parameters");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const currStatus = await manager.findOne(OrderStatus, {
          where: {
            orders: {
              id: Number(orderId),
              user: { sub: sub },
            },
          },
        });

        if (!currStatus)
          return res.status(404).send("Order not found, or unauthorized.");

        if (currStatus.isVendorControlled)
          return res.status(400).send("Please wait for Vendor confirmation...");

        const orderStatuses = await manager.find(OrderStatus);

        if (orderStatuses.length === 0)
          return res.status(404).send("No order statuses found.");

        const order = await manager.findOne(Order, {
          where: { id: Number(orderId), user: { sub: sub } },
        });
        if (!order)
          return res.status(404).send("Cannot find order or unauthorized");

        const nextStatus = findNextStatus(currStatus, orderStatuses, User);

        if (nextStatus === 202)
          return res.status(nextStatus).json({
            status: "Pending",
            message: "Please wait for Vendor(s) to confirm order(s).",
          });
        if (nextStatus === 400)
          return res.status(nextStatus).json({
            error: "Invalid request",
            message: "Cannot change order status after " + currStatus.name,
          });

        order.status = nextStatus;

        await manager.save(order);

        return res.status(200).json(order);
      });
    } catch (error) {
      handleError(new Error(String(error)), "Error updating order: " + error);
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const deleteOrder = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { orderId } = req.params;

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const order = await manager.findOne(Order, {
          where: { user: { sub: sub }, id: Number(orderId) },
        });

        if (!order)
          return res.status(404).send("Order not found with id:" + orderId);

        await manager.remove(order);

        return res.status(200).send(STATUS_CODES[200]);
      });
    } catch (error) {
      handleError(
        new Error(String(error)),
        "Error deleting order with dishId:" + orderId
      );
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const createOrderDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { orderId, dishId } = req.params;

    if (!orderId || !dishId)
      return res.status(400).json({
        error: "Invalid Request.",
        message: "Missing query params:" + dishId ?? orderId,
      });

    const arrayDishId = convertToArray(dishId);

    if (!arrayDishId)
      return res.status(500).send("Error converting dishId(s) into array");

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const order = await manager.findOne(Order, {
          where: { id: Number(orderId), user: { sub: sub } },
        });

        if (!order)
          return res
            .status(404)
            .send("Cannot find order.Please create an order first.");

        const dishes = await manager.find(Dish, {
          where: {
            id: In(arrayDishId),
            vendor: { vendorUser: { user: { sub: Not(sub) } } },
          },
        });

        if (dishes.length === 0)
          return res
            .status(404)
            .send("Dish with id: " + dishId + " not found or invalid.");

        const [defaultStatus] = await manager.find(OrderDishStatus);

        const orderDishes = dishes.map(
          (dish) => new OrderDish(order, dish, defaultStatus)
        );

        await manager.save(orderDishes);

        return res.status(201).send(orderDishes);
      });
    } catch (error) {
      return handleError(
        new Error(String(error)),
        "Create order dish operation failed",
        {
          req,
          res,
          status: 500,
        }
      );
    }
  };

  const readOrderDishes = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { orderId, dishId } = req.params;

    const arrayOrderDishIds = convertToArray(orderId);

    if (!orderId || !dishId || !arrayOrderDishIds)
      return res
        .status(400)
        .send(
          "Invalid or missing parameters" + orderId ??
            dishId ??
            arrayOrderDishIds
        );

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const orderDishes = await manager.find(OrderDish, {
          where: {
            order: { id: Number(orderId), user: { sub: sub } },
            dish: { id: In(arrayOrderDishIds) },
          },
        });

        if (!orderDishes || orderDishes.length === 0)
          return res.status(404).send("Order Dish(es) not found");

        await manager.save(orderDishes);

        return res.status(200).json(orderDishes);
      });
    } catch (error) {
      handleError(
        new Error(String(error)),
        "Error viewing order dishes: " + error
      );
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  const deleteOrderDish = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const { orderDishId, orderId } = req.params;

    const arrayOrderDishIds = convertToArray(orderDishId);

    if (!orderDishId || !orderId || !arrayOrderDishIds)
      return res
        .status(400)
        .send("Invalid request. Missing parameters:" + orderId ?? orderDishId);

    let sub: string;

    if (req.session.authCookie?.custom?.sub)
      sub = req.session.authCookie?.custom?.sub;
    else return res.status(401).send(STATUS_CODES[401]);

    try {
      await transactionWrapper(entityManager, async (manager) => {
        const orders = await manager.findOne(OrderDish, {
          where: {
            order: { user: { sub: sub }, id: Number(orderId) },
            id: In(arrayOrderDishIds),
          },
        });

        if (!orders)
          return res
            .status(404)
            .send(
              "Order dish(es) invalid or not found with id(s):" +
                arrayOrderDishIds ?? orderDishId
            );

        await manager.remove(orders);

        return res.status(200).send(STATUS_CODES[200]);
      });
    } catch (error) {
      handleError(
        new Error(String(error)),
        "Error deleting order with dishId:" + orderDishId
      );
      return res.status(500).send(STATUS_CODES[500]);
    }
  };

  return {
    createOrder,
    readOrders,
    updateOrder,
    deleteOrder,
    createOrderDish,
    readOrderDishes,
    deleteOrderDish,
  };
};
