import { Sequelize } from "sequelize-typescript";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderRepository from "./order.repository";
import { OrderModel, OrderProductModel } from "./order.model";

import { ClientModel } from "../../client-adm/repository/client.model";
import StoreCatalogProductModel from "../../store-catalog/repository/product.model";

describe("Order Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      OrderModel,
      OrderProductModel,
      ClientModel,
      StoreCatalogProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const clientProps = {
      id: new Id("1"),
      name: "John Doe",
      email: "john@example.com",
      document: "123456",
      address: new Address(
        "Street",
        "123",
        "Complement",
        "City",
        "State",
        "12345"
      ),
    };

    const client = new Client(clientProps);

    const createdAt = new Date();
    const updatedAt = new Date();

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt,
      updatedAt,
    });

    const productProps = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
      createdAt,
      updatedAt,
    };

    const product = new Product(productProps);

    await StoreCatalogProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const order = new Order({
      id: new Id("1"),
      client,
      products: [product],
      status: "pending",
    });

    const orderRepository = new OrderRepository();
    await orderRepository.addOrder(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [OrderProductModel],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      client_id: "1",
      status: "pending",
      invoice_id: null,
      total: order.total,
      products: [
        {
          id: expect.any(String),
          order_id: "1",
          product_id: "1",
        },
      ],
    });
  });

  it("should update order invoice", async () => {
    const createdAt = new Date();
    const updatedAt = new Date();

    await ClientModel.create({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      document: "123456",
      street: "Street",
      number: "123",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "12345",
      createdAt,
      updatedAt,
    });

    await OrderModel.create({
      id: "1",
      client_id: "1",
      status: "pending",
      total: 100,
    });

    const orderRepository = new OrderRepository();
    await orderRepository.updateOrderInvoice("1", "invoice-1");

    const orderModel = await OrderModel.findOne({
      where: { id: "1" },
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      client_id: "1",
      status: "pending",
      invoice_id: "invoice-1",
      total: 100,
    });
  });

  it("should throw an error when order is not found when updating invoice", async () => {
    const orderRepository = new OrderRepository();

    await expect(
      orderRepository.updateOrderInvoice("non-existing-id", "invoice-1")
    ).rejects.toThrow("Order not found");
  });
});
