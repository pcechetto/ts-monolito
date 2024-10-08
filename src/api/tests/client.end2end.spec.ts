import { app, sequelize } from "../express";
import request from "supertest";

describe("client e2e test", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "Customer 1",
        email: "qYkT8@example.com",
        document: "Customer 1 document",
        address: {
          street: "Street 1",
          number: "1",
          complement: "Complement 1",
          state: "State 1",
          city: "City 1",
          zipCode: "Zipcode 1",
        },
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");


    expect(response.status).toBe(201);
  });

  it("should not create a client", async () => {
    const response = await request(app).post("/clients").send({
      name: "Customer 1",
    });
    expect(response.status).toBe(500);
  });
});
