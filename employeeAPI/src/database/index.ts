import { MySqlDialect } from "@sequelize/mysql";
import { Sequelize } from "@sequelize/core";

export const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.DB,
  user: process.env.USERDB,
  password: process.env.PASSWORDDB,
  host: process.env.HOSTDB,
  port: Number(process.env.PORTDB),
});
