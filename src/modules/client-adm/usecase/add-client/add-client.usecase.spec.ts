import AddClientUsecase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("add client usecase unit test", () => {
  it("should add a client", async () => {
    const clientRepository = MockRepository();
    const usecase = new AddClientUsecase(clientRepository);

    const input = {
      name: "Client 1",
      email: "Uy2l6@example.com",
      address: "Client 1 address",
    };

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
  });
});
