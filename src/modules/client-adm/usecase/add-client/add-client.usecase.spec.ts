import Address from "../../../@shared/domain/value-object/address.value-object";
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
      document: "Client 1 document",
      address: new Address(
        "street 1",
        "1",
        "complemeent 1",
        "city 1",
        "state 1",
        "11111-111"
      ),
    };

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.document).toEqual(input.document);
    expect(result.address).toEqual(input.address);
  });
});
