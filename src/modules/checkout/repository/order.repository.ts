import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel, OrderProductModel } from "./order.model";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class OrderRepository implements CheckoutGateway {
  findOrder(id: string): Promise<Order | null> {
    throw new Error("Method not implemented.");
  }
  async addOrder(order: Order): Promise<Order> {
    console.log("Adding Order:", order);

    await OrderModel.create(
      {
        id: order.id.id,
        client_id: order.client.id.id,
        invoice_id: null,
        status: order.status,
        total: order.total,
        products: order.products.map((product) => ({
          id: new Id().id,
          product_id: product.id.id,
        })),
      },
      {
        include: [{ model: OrderProductModel }],
      }
    );

    return order;
  }

  async updateOrderInvoice(orderId: string, invoiceId: string): Promise<void> {
    const [affectedRows] = await OrderModel.update(
      { invoice_id: invoiceId },
      { where: { id: orderId } }
    );

    if (affectedRows === 0) {
      throw new Error("Order not found");
    }
  }
}
