import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice.items.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemsModel, InvoiceModel } from "./invoice.models";

export default class InvoiceRepository implements InvoiceGateway {
  generate(invoice: Invoice): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemsModel, as: "items" }],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoice.items?.map(
        (item) =>
          new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: invoice.createdAt,
    });
  }
}
