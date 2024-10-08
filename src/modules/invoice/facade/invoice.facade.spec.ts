import { Sequelize } from "sequelize-typescript";
import { InvoiceItemsModel, InvoiceModel } from "../repository/invoice.models";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("InvoiceFacade test", () => {
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

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository();
    const generateUsecase = new GenerateInvoiceUsecase(repository);
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    });

    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Street 1",
      number: "123",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    await facade.generate(input);

    const invoice = await InvoiceModel.findOne({
      where: { name: input.name },
      include: [{ model: InvoiceItemsModel, as: "items" }],
    });

    // console.log(invoice.id);
    expect(invoice.id).toBeDefined();
    expect(invoice).not.toBeNull();
    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.number).toBe(input.number);
    expect(invoice.complement).toBe(input.complement);
    expect(invoice.city).toBe(input.city);
    expect(invoice.state).toBe(input.state);
    expect(invoice.zipCode).toBe(input.zipCode);
    expect(invoice.items.length).toBe(2);
    expect(invoice.items[0].id).toBe(input.items[0].id);
    expect(invoice.items[0].name).toBe("Item 1");
    expect(invoice.items[0].price).toBe(input.items[0].price);
    expect(invoice.items[1].id).toBe(input.items[1].id);
    expect(invoice.items[1].name).toBe(input.items[1].name);
    expect(invoice.items[1].price).toBe(input.items[1].price);
  });

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();
    const findUsecase = new FindInvoiceUsecase(repository);
    const facade = new InvoiceFacade({
      findUsecase: findUsecase,
      generateUsecase: undefined,
    });

    const invoice = await InvoiceModel.create(
      {
        id: new Id().id,
        name: "Invoice 1",
        document: "123456789",
        street: "Street 1",
        number: "123",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345678",
        items: [
          {
            id: new Id().id,
            name: "Item 1",
            price: 100,
          },
          {
            id: new Id().id,
            name: "Item 2",
            price: 200,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        total: 300,
      },
      {
        include: [{ model: InvoiceItemsModel, as: "items" }],
      }
    );

    const result = await facade.find({ id: invoice.id });

    // console.log(result);

    expect(result.id).toBe(invoice.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address).toBeDefined;
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(invoice.items[0].id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBe(invoice.items[1].id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.total).toBe(300);
  });
});
