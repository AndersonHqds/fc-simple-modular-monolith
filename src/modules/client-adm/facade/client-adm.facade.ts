import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  FindClientFacadeOutputDto,
  FlindClientFacadeInputDto,
} from "./client-adm.interface";

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  constructor(
    private readonly _addClientUsecase: AddClientUsecase,
    private readonly _findClientUsecase: FindClientUsecase
  ) {}

  async createClient(
    input: AddClientFacadeInputDto
  ): Promise<AddClientFacadeOutputDto> {
    return this._addClientUsecase.execute(input);
  }
  async findClient(
    input: FlindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    const client = await this._findClientUsecase.execute(input.id);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
