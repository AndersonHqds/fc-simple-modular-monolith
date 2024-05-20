import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UsecaseInterface from "../../../@shared/usecase/usecase-interface";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import {
  AddClientInputDto,
  AddClientOutputDto,
} from "./add-client.usecase.dto";

export default class AddClientUsecase implements UsecaseInterface {
  constructor(private readonly _clientRepository: ClientGateway) {}

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      email: input.email,
      document: input.document,
      address: new Address({
        city: input.address.city,
        complement: input.address.complement,
        number: input.address.number,
        state: input.address.state,
        street: input.address.street,
        zipCode: input.address.zipCode,
      }),
    };

    const client = new Client(props);

    await this._clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
