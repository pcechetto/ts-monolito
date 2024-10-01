import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";

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
      address: "client 1 address",
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" } });

    expect(client).toBeDefined();
    expect(client.id).toEqual(input.id);
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.address).toEqual(input.address);
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
      address: "client 1 address",
    };

    await facade.add(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toEqual(input.id);
    expect(client.name).toEqual(client.name);
    expect(client.email).toEqual(client.email);
    expect(client.address).toEqual(client.address);
    expect(client.createdAt).toBeDefined();
    expect(client.updatedAt).toBeDefined();
  });
});
