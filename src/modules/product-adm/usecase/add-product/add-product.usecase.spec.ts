import AddProductUseCase from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Product Usecase unit tests", () => {
  it("should add a product", async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);

    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasedPrice: 10.0,
      stock: 10,
    };
    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.description).toEqual(input.description);
    expect(result.purchasedPrice).toEqual(input.purchasedPrice);
    expect(result.stock).toEqual(input.stock);
  });
});
