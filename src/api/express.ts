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
import StoreCatalogProductModel from "../modules/store-catalog/repository/product.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { incoiveRoute } from "./routes/invoice.route";
import {
  InvoiceItemsModel,
  InvoiceModel,
} from "../modules/invoice/repository/invoice.models";

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);
app.use("/products", productRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoices", incoiveRoute);

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
    StoreCatalogProductModel,
    OrderModel,
    OrderProductModel,
    TransactionModel,
    InvoiceModel,
    InvoiceItemsModel,
  ]);

  await sequelize.sync({ force: true });

  migration = migrator(sequelize);
  await migration.up();

  // await sequelize.sync({ force: true });

  // const tableInfo = await sequelize
  //   .getQueryInterface()
  //   .describeTable("products");
  // console.log("tableInfo: ", tableInfo);

  // console.log("models: ", sequelize.models);
}

setupDb();
