import Id from "../../@shared/domain/value-object/id.value-object";

export interface FindInvoiceFacadeInputDto {
  id: string;
}

export interface FindInvoiceFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  address: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  total: number;
}

export interface GenerateInvoiceFacadeInputDto {
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: {
    id: string;
    name: string;
    price: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceFacadeInputDto): Promise<{ id: string }>;
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}
