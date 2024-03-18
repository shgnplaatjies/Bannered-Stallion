import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dish } from "./Dish.entity";
import { Order } from "./Order.entity";
import { OrderDishStatus } from "./OrderDishStatus.entity";
import { Rating } from "./Rating.entity";

export interface OrderDishEntityConfig {
  status: OrderDishStatus;
  order: Order;
  dish: Dish;
  rating?: Rating;
}
@Entity()
export class OrderDish {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: "orderId", referencedColumnName: "id" })
  order: Order;

  @ManyToOne(() => OrderDishStatus, { nullable: false })
  @JoinColumn({ name: "orderDishStatusId", referencedColumnName: "id" })
  status: OrderDishStatus;

  @ManyToOne(() => Dish, { nullable: false })
  @JoinColumn({ name: "dishId", referencedColumnName: "id" })
  dish: Dish;

  @ManyToOne(() => Rating, { nullable: true })
  @JoinColumn({ name: "ratingId", referencedColumnName: "id" })
  rating?: Rating;

  static createOrderDish(config: OrderDishEntityConfig) {
    const { order, dish, status, rating } = config;
    return new OrderDish(order, dish, status, rating);
  }

  constructor(
    order: Order,
    dish: Dish,
    status: OrderDishStatus,
    rating?: Rating
  ) {
    this.order = order;
    this.dish = dish;
    this.status = status;
    if (rating) this.rating = rating;
  }
}
