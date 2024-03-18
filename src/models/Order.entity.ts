import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderDish } from "./OrderDish.entity";
import { OrderStatus } from "./OrderStatus.entity";
import { User } from "./User.entity";

export interface OrderEntityConfig {
  user: User;
  status: OrderStatus;
  created_at?: Date;
  updated_at?: Date;
  delivered_at?: Date;
  completed_at?: Date;
  orderDishes?: OrderDish[];
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => OrderStatus, { nullable: false })
  @JoinColumn({ name: "orderStatusId", referencedColumnName: "id" })
  status: OrderStatus;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @Column({ type: "datetime", nullable: true })
  delivered_at?: Date | null;

  @Column({ type: "datetime", nullable: true })
  completed_at?: Date | null;

  @OneToMany(() => OrderDish, (orderDish) => orderDish.order, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "orderDishId", referencedColumnName: "id" })
  orderDishes?: OrderDish[];

  static createOrder(config: OrderEntityConfig) {
    const { user, status } = config;
    return new Order(user, status);
  }

  constructor(user: User, status: OrderStatus) {
    this.user = user;
    this.status = status;
  }
}
