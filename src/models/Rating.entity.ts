import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderDish } from "./OrderDish.entity";

export interface RatingEntityConfig {
  score: number;
}
@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  score: number;

  @OneToMany(() => OrderDish, (orderDish) => orderDish.rating, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "orderDishId", referencedColumnName: "id" })
  orderDishes?: OrderDish[];

  static createRating(config: RatingEntityConfig) {
    const { score } = config;
    return new Rating(score);
  }

  constructor(score: number) {
    this.score = score;
  }
}
