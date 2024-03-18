import { EntityManager } from "typeorm";
import {
  OrderDishStatus,
  OrderDishStatusType,
} from "../../models/OrderDishStatus.entity";
import { OrderStatus, OrderStatusType } from "../../models/OrderStatus.entity";
import { Rating } from "../../models/Rating.entity";
import { Role, RoleType } from "../../models/Role.entity";
import { transactionWrapper } from "./transaction.service";

const populateRoles = async (manager: EntityManager) => {
  try {
    const existing = await manager.find(Role);

    if (existing.length > 0) return false;

    const roles = [
      new Role(RoleType.ADMIN),
      new Role(RoleType.VENDOR),
      new Role(RoleType.CUSTOMER),
    ];

    await manager.save(roles);

    return true;
  } catch (error) {
    console.error("Error populating ratings:", error);
    return false;
  }
};

const populateRatings = async (manager: EntityManager) => {
  try {
    const existing = await manager.find(Rating);
    if (existing.length > 0) return false;

    const ratings = [
      manager.create(Rating, { score: 0 }),
      manager.create(Rating, { score: 1 }),
      manager.create(Rating, { score: 2 }),
      manager.create(Rating, { score: 4 }),
      manager.create(Rating, { score: 4 }),
      manager.create(Rating, { score: 5 }),
    ];

    await manager.save(ratings);
    return ratings;
  } catch (error) {
    console.error("Error populating ratings:", error);
    return false;
  }
};

const populateOrderStatus = async (manager: EntityManager) => {
  const existing = await manager.find(OrderStatus);
  if (existing.length > 0) return false;
  try {
    const statuses = [
      manager.create(OrderStatus, {
        name: OrderStatusType.DEFAULT,
        isVendorControlled: false,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.CONFIRMED,
        isVendorControlled: false,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.PREPARING,
        isVendorControlled: true,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.QUEUED,
        isVendorControlled: true,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.DELIVERING,
        isVendorControlled: true,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.DELIVERED,
        isVendorControlled: false,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.CLEANUP,
        isVendorControlled: false,
      }),
      manager.create(OrderStatus, {
        name: OrderStatusType.COMPLETE,
        isVendorControlled: false,
      }),
    ];

    await manager.save(statuses);
    return true;
  } catch (error) {
    console.error("Error populating order statuses:", error);
    return false;
  }
};

const populateOrderDishStatuses = async (manager: EntityManager) => {
  const existing = await manager.find(OrderDishStatus);
  if (existing.length > 0) return false;
  try {
    const statuses = [
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.DEFAULT,
        isVendorControlled: false,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.CONFIRMED,
        isVendorControlled: false,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.PREPARING,
        isVendorControlled: true,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.QUEUE,
        isVendorControlled: true,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.DELIVERING,
        isVendorControlled: true,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.DELIVERED,
        isVendorControlled: true,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.CLEANUP,
        isVendorControlled: false,
      }),
      manager.create(OrderDishStatus, {
        name: OrderDishStatusType.COMPLETE,
        isVendorControlled: false,
      }),
    ];

    await manager.save(statuses);
    return true;
  } catch (error) {
    console.error("Error populating order dish statuses:", error);
    return false;
  }
};

export async function populateDatabaseStaticTables(
  entityManager: EntityManager
) {
  transactionWrapper(entityManager, async (manager) => {
    const roles = await populateRoles(manager);

    const ratings = await populateRatings(manager);

    const orderStatuses = await populateOrderStatus(manager);

    const orderDishStatuses = await populateOrderDishStatuses(manager);
  });
}
