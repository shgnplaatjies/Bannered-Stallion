import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";
import { Vendor } from "./Vendor.entity";

export interface VendorUserEntityConfig {
  user: User;
  vendor?: Vendor;
}

@Entity()
export class VendorUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToOne(() => Vendor, { nullable: true })
  @JoinColumn({ name: "vendorId", referencedColumnName: "id" })
  vendor?: Vendor;

  static createVendorUser(config: VendorUserEntityConfig) {
    const { user, vendor } = config;
    if (vendor) return new VendorUser(user, vendor);
    return new VendorUser(user);
  }

  constructor(user: User, vendor?: Vendor) {
    this.user = user;
    this.vendor = vendor;
  }
}
