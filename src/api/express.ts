import express, { Express } from "express";
import { clientRoute } from "./routes/client.route";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { productRoute } from "./routes/product.route";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { checkoutRoute } from "./routes/checkout.route";
import {
  OrderModel,
  OrderProductModel,
} from "../modules/checkout/repository/order.model";
import { migrator } from "../test-migrations/config-migrations/migrator";
import { Umzug } from "umzug";

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkout", checkoutRoute);

export let sequelize: Sequelize;
let migration: Umzug<any>;

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });

  sequelize.addModels([
    ClientModel,
    ProductModel,
    OrderModel,
    OrderProductModel,
  ]);

  migration = migrator(sequelize);
  await migration.up();

  console.log("models: ", sequelize.models);
}

setupDb();
