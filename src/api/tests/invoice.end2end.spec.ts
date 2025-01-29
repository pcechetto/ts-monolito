import request from "supertest";
import { app } from "../express";
import { migrator } from "../../test-migrations/config-migrations/migrator";
import { Sequelize } from "sequelize-typescript";
import {
  InvoiceModel,
  InvoiceItemsModel,
} from "../../modules/invoice/repository/invoice.models";
import { Umzug } from "umzug";

let sequelize: Sequelize;
let migration: Umzug<any>;

beforeEach(async () => {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels([InvoiceModel, InvoiceItemsModel]);

  await sequelize.sync({ force: true });

  migration = migrator(sequelize);
  await migration.up();

  await sequelize.sync({ force: true });
});

afterEach(async () => {
  if (!migration || !sequelize) {
    return;
  }
  await migration.down();
  await sequelize.close();
});

describe("invoice end2end tests", () => {
  it("should retrieve an existing invoice", async () => {
    const invoiceData = {
      id: "invoice-123",
      name: "John Doe",
      document: "123456789",
      street: "Main St",
      number: "100",
      complement: "Apt 1",
      city: "Cityville",
      state: "ST",
      zipCode: "12345",
      total: 80,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const invoice = await InvoiceModel.create(invoiceData);

    const itemsData = [
      {
        id: "item-1",
        invoiceId: invoice.id,
        name: "Product A",
        price: 50,
      },
      {
        id: "item-2",
        invoiceId: invoice.id,
        name: "Product B",
        price: 30,
      },
    ];

    await InvoiceItemsModel.bulkCreate(itemsData);

    const response = await request(app).get(`/invoices/${invoice.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: invoiceData.id,
      name: invoiceData.name,
      document: invoiceData.document,
      address: {
        street: invoiceData.street,
        number: invoiceData.number,
        complement: invoiceData.complement,
        city: invoiceData.city,
        state: invoiceData.state,
        zipCode: invoiceData.zipCode,
      },
      items: itemsData.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      total: invoiceData.total,
      createdAt: invoiceData.createdAt.toISOString(),
    });
  });

  it("should return 404 for a non-existing invoice", async () => {
    const response = await request(app).get("/invoices/non-existing-id");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
