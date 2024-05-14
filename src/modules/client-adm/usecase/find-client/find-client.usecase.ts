import UsecaseInterface from "../../../@shared/usecase/usecase-interface";
import ClientGateway from "../../gateway/client.gateway";

export default class FindClientUsecase implements UsecaseInterface {
  constructor(private readonly _clientRepository: ClientGateway) {}

  execute(id: string) {
    return this._clientRepository.find(id);
  }
}
