import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { AddProductInputDto, AddProductOutputDto } from "./add-product.dto";

export default class AddProductUseCase {
  private productRepository: ProductGateway;

  constructor(_productRepository: ProductGateway) {
    this.productRepository = _productRepository;
  }
  async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasedPrice: input.purchasedPrice,
      stock: input.stock,
    };

    const product = new Product(props);
    this.productRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasedPrice: product.purchasedPrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
