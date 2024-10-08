import { app, sequelize } from "../express";
import request from "supertest";

describe("Product e2e test", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });
  afterAll(async () => {
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
