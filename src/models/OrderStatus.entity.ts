import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order.entity";

export enum OrderStatusType {
  DEFAULT = "Pending/InCart", // user-controlled, through Order.status
  CONFIRMED = "Paid/Confirmed", // user-controlled, through Order.status
  PREPARING = "Preparing",
  QUEUED = "Queued",
  DELIVERING = "Delivering",
  DELIVERED = "Eating/Delivered", //  user-controlled, through Order.status
  CLEANUP = "CleanUp",
  COMPLETE = "Complete",
}
export interface OrderStatusEntityConfig {
  name: OrderStatusType;
  orders?: Order[];
  isVendorControlled: boolean;
}

@Entity()
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name: OrderStatusType;

  @OneToMany(() => Order, (order) => order.status, { nullable: true })
  @JoinColumn({ name: "orderId", referencedColumnName: "id" })
  orders?: Order[];

  @Column({ nullable: false })
  isVendorControlled: boolean;

  static createOrderStatus(config: OrderStatusEntityConfig) {
    const { name, isVendorControlled } = config;
    return new OrderStatus(name, isVendorControlled);
  }

  constructor(name: OrderStatusType, isVendorControlled: boolean) {
    this.name = name;
    this.isVendorControlled = isVendorControlled;
  }
}
