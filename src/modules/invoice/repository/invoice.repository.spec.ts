import { Sequelize } from "sequelize-typescript";
import { InvoiceModel, InvoiceItemsModel } from "./invoice.models";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
      models: [InvoiceModel, InvoiceItemsModel],
    });
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice 1",
        document: "Document",
        street: "123 Street",
        number: "1",
        complement: "Apt 1",
        city: "City",
        state: "State",
        zipCode: "12345",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          { id: "1", name: "Item 1", price: 100 },
          { id: "2", name: "Item 2", price: 200 },
        ],
        total: 300,
      },
      {
        include: [{ model: InvoiceItemsModel, as: "items" }],
      }
    );

    const invoiceRepository = new InvoiceRepository();
    const found = await invoiceRepository.find(invoice.id);

    expect(found.id.id).toBe(invoice.id);
    expect(found.name).toBe(invoice.name);
    expect(found.document).toBe(invoice.document);
    expect(found.address.street).toBe(invoice.street);
    expect(found.address.number).toBe(invoice.number);
    expect(found.items).toHaveLength(2);
    expect(found.items[0].id.id).toBe(invoice.items[0].id);
    expect(found.items[0].name).toBe(invoice.items[0].name);
    expect(found.items[0].price).toBe(invoice.items[0].price);
    expect(found.items[1].id.id).toBe(invoice.items[1].id);
    expect(found.items[1].name).toBe(invoice.items[1].name);
    expect(found.items[1].price).toBe(invoice.items[1].price);
    expect(found.total()).toBe(300);
    expect(found.createdAt).toEqual(invoice.createdAt);
  });
});
