import express, { Express } from "express";
import { clientRoute } from "./routes/client.route";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { productRoute } from "./routes/product.route";
import { ProductModel } from "../modules/product-adm/repository/product.model";

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);
app.use("/products", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels([ClientModel, ProductModel]);
  await sequelize.sync();
}

setupDb();
