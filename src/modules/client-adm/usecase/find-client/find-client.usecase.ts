import Address from "../../../@shared/domain/value-object/address.value-object";
import CLientGateway from "../../gateway/client.gateway";
import {
  FindClientInputDto,
  FindClientOutputDto,
} from "./find-client.usecase.dto";

export default class FindClientUsecase {
  private _clientRepository: CLientGateway;

  constructor(clientRepository: CLientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const result = await this._clientRepository.find(input.id);

    return {
      id: result.id.id,
      name: result.name,
      email: result.email,
      document: result.document,
      address: new Address(
        result.address.street,
        result.address.number,
        result.address.complement,
        result.address.city,
        result.address.state,
        result.address.zipCode
      ),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
