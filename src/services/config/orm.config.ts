import { DataSourceOptions } from "typeorm";

export const getOrmConnectionOptions = (): DataSourceOptions => {
  return {
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // NB! May wipe entire database if set to `true`.
    entities: ["src/models/*.entity.ts"],
    // logging: process.env.NODE_ENV === "dev",
  };
};
