import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User.entity";

export enum RoleType {
  ADMIN = "Admin",
  VENDOR = "Vendor",
  CUSTOMER = "Customer",
}

export interface RoleEntityConfig {
  name: RoleType;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: RoleType;

  @OneToMany(() => User, (user) => user.role, {
    nullable: true,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  users?: User[];

  static createRole(config: RoleEntityConfig) {
    const { name } = config;
    return new Role(name);
  }

  constructor(name: RoleType) {
    this.name = name;
  }
}
