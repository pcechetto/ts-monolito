import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice.items.entity";
import FindInvoiceUsecase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "invoice",
  document: "document",
  address: new Address(
    "street",
    "number",
    "complement",
    "city",
    "state",
    "zipCode"
  ),
  items: [
    new InvoiceItems({
      id: new Id("1"),
      name: "item 1",
      price: 100,
    }),
    new InvoiceItems({
      id: new Id("2"),
      name: "item 2",
      price: 200,
    }),
    new InvoiceItems({
      id: new Id("3"),
      name: "item 3",
      price: 300,
    }),
  ],
});

const MockRepository = () => ({
  find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  generate: jest.fn(),
});

describe("Find Invoice Usecase tests", () => {
  it("should find invoice", async () => {
    const invoiceRepository = MockRepository();
    const findInvoiceUsecase = new FindInvoiceUsecase(invoiceRepository);

    const input = {
      id: "1",
    };

    const output = await findInvoiceUsecase.execute(input);

    expect(output.id).toBe(invoice.id.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);

    expect(output.address.street).toBe(invoice.address.street);
    expect(output.address.number).toBe(invoice.address.number);
    expect(output.address.complement).toBe(invoice.address.complement);
    expect(output.address.city).toBe(invoice.address.city);
    expect(output.address.state).toBe(invoice.address.state);
    expect(output.address.zipCode).toBe(invoice.address.zipCode);

    expect(output.items[0].id).toBe(invoice.items[0].id.id);
    expect(output.items[0].name).toBe(invoice.items[0].name);
    expect(output.items[0].price).toBe(invoice.items[0].price);

    expect(output.items[1].id).toBe(invoice.items[1].id.id);
    expect(output.items[1].name).toBe(invoice.items[1].name);
    expect(output.items[1].price).toBe(invoice.items[1].price);

    expect(output.items[2].id).toBe(invoice.items[2].id.id);
    expect(output.items[2].name).toBe(invoice.items[2].name);
    expect(output.items[2].price).toBe(invoice.items[2].price);

    expect(output.total).toBe(600);
  });
});
