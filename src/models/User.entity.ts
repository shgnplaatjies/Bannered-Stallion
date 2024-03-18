import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order.entity";
import { Role } from "./Role.entity";
import { VendorUser } from "./VendorUser.entity";

export interface UserEntityConfig {
  name: string;
  sub: string;
  email: string;
  role: Role;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  sub: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: "roleId", referencedColumnName: "id" })
  role: Role;

  @OneToMany(() => VendorUser, (vendorUser) => vendorUser.user, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "vendorUserId", referencedColumnName: "id" })
  vendorUsers?: VendorUser[];

  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "orderId", referencedColumnName: "id" })
  orders?: Order[];

  static createUser(config: UserEntityConfig) {
    return new User(config.name, config.sub, config.email, config.role);
  }

  constructor(name: string, sub: string, email: string, role: Role) {
    this.name = name;
    this.sub = sub;
    this.email = email;
    this.role = role;
  }
}
