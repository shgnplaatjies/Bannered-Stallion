import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderDish } from "./OrderDish.entity";

export enum OrderDishStatusType {
  DEFAULT = "Pending/InCart", // user-controlled, cascade change to all order.order_dishes[]
  CONFIRMED = "Paid/Confirmed",
  PREPARING = "Preparing",
  QUEUE = "Queued",
  DELIVERING = "Delivering",
  DELIVERED = "Eating/Delivered", // user-controlled, cascade change to all order.order_dishes[]
  CLEANUP = "CleanUp",
  COMPLETE = "Complete",
}
export interface OrderDishStatusEntityConfig {
  orderDishes?: OrderDish[];
  name: OrderDishStatusType;
  isVendorControlled: boolean;
}

@Entity()
export class OrderDishStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "Pending", nullable: false })
  name: OrderDishStatusType;

  @Column({ type: "bool", default: false, nullable: false })
  isVendorControlled: boolean;

  @OneToMany(() => OrderDish, (orderDish) => orderDish.status, {
    nullable: true,
  })
  @JoinColumn({ name: "orderDishId", referencedColumnName: "id" })
  orderDishes?: OrderDish[];

  static createOrderDishStatus(config: OrderDishStatusEntityConfig) {
    const { name, isVendorControlled } = config;
    return new OrderDishStatus(name, isVendorControlled);
  }

  constructor(
    name: OrderDishStatusType,
    isVendorControlled: boolean,
    description?: string
  ) {
    this.name = name;
    this.isVendorControlled = isVendorControlled;
  }
}
