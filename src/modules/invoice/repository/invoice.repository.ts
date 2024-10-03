import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice.items.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemsModel, InvoiceModel } from "./invoice.models";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        document: invoice.document,
        name: invoice.name,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: invoice.total(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemsModel, as: "items" }],
      }
    );
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
