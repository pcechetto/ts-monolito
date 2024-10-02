import ValueObject from "./value-object.interface";

export default class Address implements ValueObject {
  private _street: string;
  private _number: string;
  private _complement: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;

  constructor(address: Address) {
    this._street = address._street;
    this._number = address._number;
    this._complement = address._complement;
    this._city = address._city;
    this._state = address._state;
    this._zipCode = address._zipCode;
    this.validate();
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string {
    return this._complement;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  validate() {
    if (
      !this._street ||
      !this._number ||
      !this._city ||
      !this._state ||
      !this._zipCode
    ) {
      throw new Error("Address is invalid");
    }
  }
}
