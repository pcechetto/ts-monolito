import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  purchasedPrice: 10.0,
  stock: 10,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("Check Stock Usecase unit tests", () => {
  it("should check stock", async () => {
    const productRepository = MockRepository();
    const checkStockUsecase = new CheckStockUseCase(productRepository);
    const input = {
      productId: "1",
    };
    const result = await checkStockUsecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result.productId).toBeDefined();
    expect(result.productId).toBe(input.productId);
    expect(result.stock).toBe(10);
  });
});
