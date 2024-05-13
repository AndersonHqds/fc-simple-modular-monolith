import FindAllProductsUsecase from "../usecase/find-all-products.usecase";
import FindProductUsecase from "../usecase/find-product.usecase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.interface";

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  constructor(
    private readonly _findUsecase: FindProductUsecase,
    private readonly _findAllUsecase: FindAllProductsUsecase
  ) {}

  async find(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUsecase.execute({
      id: input.id,
    });
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUsecase.execute();
  }
}
