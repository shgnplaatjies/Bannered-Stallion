import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dish } from "./Dish.entity";
import { VendorUser } from "./VendorUser.entity";

export interface VendorEntityConfig {
  name: string;
  vendorUser: VendorUser;
}

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Dish, (dish) => dish.vendor, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  dishes?: Dish[];

  @OneToOne(() => VendorUser, (vendorUser) => vendorUser.vendor, {
    nullable: false,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "vendorUserId", referencedColumnName: "id" })
  vendorUser: VendorUser;

  static createVendor(config: VendorEntityConfig) {
    const { name, vendorUser } = config;
    return new Vendor(name, vendorUser);
  }

  constructor(name: string, vendorUser: VendorUser) {
    this.name = name;
    this.vendorUser = vendorUser;
  }
}
