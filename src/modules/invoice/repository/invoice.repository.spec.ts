import { Sequelize } from "sequelize-typescript";
import { InvoiceModel, InvoiceItemsModel } from "./invoice.models";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItems from "../domain/invoice.items.entity";

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

  it("should generate an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document",
      address: new Address(
        "123 Street",
        "1",
        "Apt 1",
        "City",
        "State",
        "12345"
      ),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Item 1",
          price: 100,
        }),
        new InvoiceItems({
          id: new Id("2"),
          name: "Item 2",
          price: 200,
        }),
      ],
    });
    await invoiceRepository.generate(invoice);

    const found = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ model: InvoiceItemsModel, as: "items" }],
    });

    expect(found.id).toBe("1");
    expect(found.name).toBe("Invoice 1");
    expect(found.document).toBe("Document");
    expect(found.street).toBe("123 Street");
    expect(found.number).toBe("1");
    expect(found.complement).toBe("Apt 1");
    expect(found.city).toBe("City");
    expect(found.state).toBe("State");
    expect(found.zipCode).toBe("12345");
    expect(found.items).toHaveLength(2);
    expect(found.items[0].id).toBe("1");
    expect(found.items[0].name).toBe("Item 1");
    expect(found.items[0].price).toBe(100);
    expect(found.items[1].id).toBe("2");
    expect(found.items[1].name).toBe("Item 2");
    expect(found.items[1].price).toBe(200);
    expect(found.total).toBe(300);
  });
});
