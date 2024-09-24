export interface AddProductFacadeInputDto {
  id?: string;
  name: string;
  description: string;
  purchasedPrice: number;
  stock: number;
}

export interface CheckStockFacadeInputDto {
  productId: string;
}

export interface CheckStockFacadeOutputDto {
  productId: string;
  stock: number;
}

export default interface ProductAdmFacadeInterface {
  addProduct(input: AddProductFacadeInputDto): Promise<void>;
  checkstock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto>;
}
