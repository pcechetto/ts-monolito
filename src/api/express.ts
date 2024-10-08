import express, { Express } from "express";
import { clientRoute } from "./routes/client.route";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";

export const app: Express = express();
app.use(express.json());

app.use("/clients", clientRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels([ClientModel]);
  await sequelize.sync();
}

setupDb();
