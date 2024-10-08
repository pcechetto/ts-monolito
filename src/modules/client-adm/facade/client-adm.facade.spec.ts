import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import Address from "../../@shared/domain/value-object/address.value-object";

describe("client adm facade test", () => {
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
    const repository = new ClientRepository();
    const addUseCase = new AddClientUsecase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUseCase,
      findUsecase: undefined,
    });

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
  });

  it("should find a client", async () => {
    const repository = new ClientRepository();
    const findUsecase = new FindClientUsecase(repository);
    const addUseCase = new AddClientUsecase(repository);
    const facade = new ClientAdmFacade({
      addUsecase: addUseCase,
      findUsecase: findUsecase,
    });

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
