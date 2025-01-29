import { Umzug } from "umzug";
import { migrator } from "../../test-migrations/config-migrations/migrator";
import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";

describe("Product e2e test", () => {
  let sequelize: Sequelize;

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ProductModel]);

    // await sequelize.sync({ force: true });

    migration = migrator(sequelize);
    await migration.up();

    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasedPrice: 10,
        stock: 10,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    console.log("Response body:", JSON.stringify(response.body, null, 2));

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.stock).toBe(10);
    expect(response.body.purchasedPrice).toBe(10);
    expect(response.body.id).toBeDefined();
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
    });
    expect(response.status).toBe(500);
  });
});
