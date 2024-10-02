import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice.items.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUsecase implements UseCaseInterface {
  private invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceGateway) {
    this.invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const address = new Address(
      input.street,
      input.number,
      input.complement,
      input.city,
      input.state,
      input.zipCode
    );

    const items = input.items.map((item) => {
      return new InvoiceItems({
        name: item.name,
        price: item.price,
        id: new Id(item.id),
      });
    });

    const props = {
      name: input.name,
      document: input.document,
      address: address,
      items: items,
    };

    const invoice = new Invoice(props);
    await this.invoiceRepository.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        };
      }),
      total: invoice.items.map((item) => item.price).reduce((a, b) => a + b),
    };
  }
}
