import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import CLientGateway from "../../gateway/client.gateway";
import {
  AddClientInputDto,
  AddClientOutputDto,
} from "./add-client.usecase.dto";

export default class AddClientUsecase {
  private _clientRepository: CLientGateway;

  constructor(clientRepository: CLientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      id: new Id(input.id) || new Id(),
      name: input.name,
      email: input.email,
      address: input.address,
    };

    const client = new Client(props);
    await this._clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      updatedAt: client.updatedAt,
      createdAt: client.createdAt,
    };
  }
}
