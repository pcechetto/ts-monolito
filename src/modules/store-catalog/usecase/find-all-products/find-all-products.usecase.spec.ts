import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUsecase from "./find-all-products.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 10.0,
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  description: "Product 2 description",
  salesPrice: 20.0,
});

const MockRepository = () => {
  return {
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
    find: jest.fn(),
  };
};

describe("FindAllProductsUsecase usecase unit test", () => {
  it("should find all products", async () => {
    const productRepository = MockRepository();
    const usecase = new FindAllProductsUsecase(productRepository);

    const result = await usecase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.products).toHaveLength(2);
    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe(product.name);
    expect(result.products[1].id).toBe(product2.id.id);
    expect(result.products[1].name).toBe(product2.name);
  });
});
