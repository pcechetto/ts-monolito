import AggregateRoot from "../../@shared/domain/entity/aggregate_root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  purchasedPrice: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _purchasedPrice: number;
  private _stock: number;

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._purchasedPrice = props.purchasedPrice;
    this._stock = props.stock;

    this.validate();
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get purchasedPrice(): number {
    return this._purchasedPrice;
  }

  get stock(): number {
    return this._stock;
  }

  set name(name: string) {
    this._name = name;
  }

  set stock(stock: number) {
    this._stock = stock;
  }

  set description(description: string) {
    this._description = description;
  }

  set purchasePrice(purchasedPrice: number) {
    this._purchasedPrice = purchasedPrice;
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._purchasedPrice <= 0) {
      throw new Error("Purchased price must be greater than zero");
    }
    if (this._stock <= 0) {
      throw new Error("Stock must be greater than zero");
    }
    if (this._description.length === 0) {
      throw new Error("Description is required");
    }
  }
}
