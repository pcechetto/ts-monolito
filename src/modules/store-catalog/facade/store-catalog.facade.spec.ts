import { Sequelize } from "sequelize-typescript";

import StoreCatalogFacadeFactory from "../factory/facade.factory";
import StoreCatalogProductModel from "../repository/product.model";

describe("StoreCatalogFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([StoreCatalogProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const facade = StoreCatalogFacadeFactory.create();

    await StoreCatalogProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    const product = await facade.find({ id: "1" });

    expect(product.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Product 1 description");
    expect(product.salesPrice).toBe(100);
  });

  it("should find all products", async () => {
    const facade = StoreCatalogFacadeFactory.create();

    await StoreCatalogProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    });

    await StoreCatalogProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 200,
    });

    const products = await facade.findAll();

    expect(products.products.length).toBe(2);
    expect(products.products[0].id).toBe("1");
    expect(products.products[0].name).toBe("Product 1");
    expect(products.products[0].description).toBe("Product 1 description");
    expect(products.products[0].salesPrice).toBe(100);
    expect(products.products[1].id).toBe("2");
    expect(products.products[1].name).toBe("Product 2");
    expect(products.products[1].description).toBe("Product 2 description");
    expect(products.products[1].salesPrice).toBe(200);
  });
});
