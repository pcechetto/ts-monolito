import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "./client-adm.facade.factory";
import Address from "../../@shared/domain/value-object/address.value-object";

describe("ClientAdmFacadeFactory test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "client 1",
      email: "client 1 email",
      document: "client 1 document",
      address: new Address(
        "street 1",
        "1",
        "complemeent 1",
        "city 1",
        "state 1",
        "11111-111"
      ),
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client.id).toEqual(input.id);
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.street).toEqual(input.address.street);
    expect(client.number).toEqual(input.address.number);
    expect(client.complement).toEqual(input.address.complement);
    expect(client.city).toEqual(input.address.city);
    expect(client.state).toEqual(input.address.state);
    expect(client.zipCode).toEqual(input.address.zipCode);
  });
  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "client 1",
      email: "client 1 email",
      document: "client 1 document",
      address: new Address(
        "street 1",
        "1",
        "complemeent 1",
        "city 1",
        "state 1",
        "11111-111"
      ),
    };

    await facade.add(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.address.street).toBe(input.address.street);
    expect(client.address.number).toBe(input.address.number);
    expect(client.address.complement).toBe(input.address.complement);
    expect(client.address.city).toBe(input.address.city);
    expect(client.address.state).toBe(input.address.state);
    expect(client.address.zipCode).toBe(input.address.zipCode);
  });
});
