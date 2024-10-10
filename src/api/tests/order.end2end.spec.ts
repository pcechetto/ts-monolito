import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import { app, sequelize } from "../express";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../test-migrations/config-migrations/migrator";
import {
  OrderModel,
  OrderProductModel,
} from "../../modules/checkout/repository/order.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import {
  InvoiceItemsModel,
  InvoiceModel,
} from "../../modules/invoice/repository/invoice.models";

describe("order e2e test", () => {
  let sequelize: Sequelize;

  let migration: Umzug<any>;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([
      ProductModel,
      OrderModel,
      StoreCatalogProductModel,
      OrderProductModel,
      ClientModel,
      TransactionModel,
      InvoiceModel,
      InvoiceItemsModel,
    ]);

    await sequelize.sync({ force: true });

    const migration = migrator(sequelize);
    await migration.up();

    const tableInfo = await sequelize
      .getQueryInterface()
      .describeTable("products");
    console.log(
      "Products table structure:",
      JSON.stringify(tableInfo, null, 2)
    );
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a order", async () => {
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "qYkT8@example.com",
      document: "Client 1 document",
      street: "street 1",
      number: "1",
      complement: "complement 1",
      city: "city 1",
      state: "state 1",
      zipCode: "11111-111",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await StoreCatalogProductModel.create({
      id: "2",
      name: "My Product 2",
      description: "Product description",
      salesPrice: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await StoreCatalogProductModel.create({
      id: "1",
      name: "My Product 1",
      description: "Product description",
      salesPrice: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.create({
      id: "1",
      name: "My Product 1",
      description: "Product description",
      purchasedPrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.create({
      id: "2",
      name: "My Product 2",
      description: "Product description",
      purchasedPrice: 25,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      });

    expect(response.status).toBe(201);
    expect(response.body.clientId).toBe("1");
    expect(response.body.products).toStrictEqual([
      {
        productId: "1",
        quantity: 1,
      },
      {
        productId: "2",
        quantity: 2,
      },
    ]);
  });
});
