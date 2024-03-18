import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendor } from "./Vendor.entity";

export interface DishEntityConfig {
  vendor: Vendor;
  name: string;
  price: number;
}

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Vendor, { nullable: false })
  @JoinColumn({ name: "vendorId", referencedColumnName: "id" })
  vendor: Vendor;

  @Column({ nullable: false })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  price: number;

  static createDish(config: DishEntityConfig) {
    const { vendor, name, price } = config;
    return new Dish(vendor, name, price);
  }

  constructor(vendor: Vendor, name: string, price: number) {
    this.vendor = vendor;
    this.name = name;
    this.price = price;
  }
}
