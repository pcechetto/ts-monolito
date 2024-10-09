import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import {
  CheckoutFacadeInputDto,
  CheckoutFacadeInterface,
  CheckoutFacadeOutputDto,
} from "./checkout.facade.interface";

export interface UsecaseProps {
  placeOrderUsecase: UseCaseInterface;
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
  private _placeOrderUsecase: UseCaseInterface;
  constructor(usecaseProps: UsecaseProps) {
    this._placeOrderUsecase = usecaseProps.placeOrderUsecase;
  }

  async placeOrder(
    input: CheckoutFacadeInputDto
  ): Promise<CheckoutFacadeOutputDto> {
    const placeOrderOutput = await this._placeOrderUsecase.execute(input);
    return {
      invoiceId: placeOrderOutput.invoice.id,
      id: placeOrderOutput.order.id,
      status: placeOrderOutput.order.status,
      total: placeOrderOutput.order.total,
      products: placeOrderOutput.order.products.map((product: { id: any }) => ({
        productId: product.id,
      })),
    };
  }
}
