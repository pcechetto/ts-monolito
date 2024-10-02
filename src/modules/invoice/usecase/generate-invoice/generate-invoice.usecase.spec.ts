import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const MockInvoiceRepository = () => ({
  generate: jest.fn(),
  find: jest.fn(),
});

describe("GenerateInvoiceUsecase test", () => {
  it("should generate invoice", async () => {
    const invoiceRepository = MockInvoiceRepository();
    const generateInvoiceUsecase = new GenerateInvoiceUsecase(
      invoiceRepository
    );

    const input = {
      name: "invoice",
      document: "document",
      street: "street",
      number: "number",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
      items: [
        {
          id: "1",
          name: "item",
          price: 100,
        },
        {
          id: "2",
          name: "item2",
          price: 200,
        },
      ],
    };

    const output = await generateInvoiceUsecase.execute(input);

    expect(output.id).toBeDefined;
    expect(output.name).toEqual(input.name);
    expect(output.document).toEqual("document");
    expect(output.street).toEqual("street");
    expect(output.number).toEqual("number");
    expect(output.complement).toEqual("complement");
    expect(output.city).toEqual("city");
    expect(output.state).toEqual("state");
    expect(output.zipCode).toEqual("zipCode");
    expect(output.items[0].id).toEqual("1");
    expect(output.items[0].name).toEqual("item");
    expect(output.items[0].price).toEqual(100);
    expect(output.total).toEqual(300);
  });
});
