import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import StoreCatalogProductModel from "../../store-catalog/repository/product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare client_id: string;

  @Column({ allowNull: true })
  declare invoice_id: string;

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare total: number;

  @BelongsTo(() => ClientModel, { foreignKey: "client_id" })
  declare client: ClientModel;

  @HasMany(() => OrderProductModel, { foreignKey: "order_id" })
  declare products: OrderProductModel[];
}

@Table({
  tableName: "order_products",
  timestamps: false,
})
export class OrderProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  declare order_id: string;

  @ForeignKey(() => StoreCatalogProductModel)
  @Column({ allowNull: false })
  declare product_id: string;

  @BelongsTo(() => OrderModel)
  declare order: OrderModel;

  @BelongsTo(() => StoreCatalogProductModel)
  declare product: StoreCatalogProductModel;
}
