import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  InvoiceFacadeInterface,
} from "./invoice.facade.interface";

export interface UsecaseProps {
  generateUsecase: UseCaseInterface;
  findUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(usecaseProps: UsecaseProps) {
    this._generateUsecase = usecaseProps.generateUsecase;
    this._findUsecase = usecaseProps.findUsecase;
  }
  async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
    await this._generateUsecase.execute(input);
  }
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
