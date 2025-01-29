import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { app } from "../express";
import { migrator } from "../../test-migrations/config-migrations/migrator";

describe("client e2e test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ClientModel]);

    // await sequelize.sync({ force: true });

    const migration = migrator(sequelize);
    await migration.up();

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    sequelize.close();
  });

  it("should create a client", async () => {
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
