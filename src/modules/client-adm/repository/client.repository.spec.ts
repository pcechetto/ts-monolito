import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";

describe("ClientRepository test", () => {
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

  it("should find a client", async () => {
    const client = await ClientModel.create({
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
    const clientRepository = new ClientRepository();
    const result = await clientRepository.find(client.id);

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address.street).toEqual(client.street);
    expect(result.address.number).toEqual(client.number);
    expect(result.address.complement).toEqual(client.complement);
    expect(result.address.city).toEqual(client.city);
    expect(result.address.state).toEqual(client.state);
    expect(result.address.zipCode).toEqual(client.zipCode);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should create a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "qYkT8@example.com",
      document: "Client 1 document",
      address: new Address(
        "street 1",
        "1",
        "complemeent 1",
        "city 1",
        "state 1",
        "11111-111"
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    await clientRepository.add(client);

    const result = await ClientModel.findOne({
      where: { id: "1" },
    });

    expect(result).toBeDefined();
    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toEqual(client.document);
    expect(result.street).toEqual(client.address.street);
    expect(result.number).toEqual(client.address.number);
    expect(result.complement).toEqual(client.address.complement);
    expect(result.city).toEqual(client.address.city);
    expect(result.state).toEqual(client.address.state);
    expect(result.zipCode).toEqual(client.address.zipCode);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });
});
