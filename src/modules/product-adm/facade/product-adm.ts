import UsecaseInterface from "../../@shared/usecase/usecase-interface";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.interface";

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  constructor(
    private readonly _addUsecase: UsecaseInterface,
    private readonly _checkStockUsecase: UsecaseInterface
  ) {}

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addUsecase.execute(input);
  }
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUsecase.execute(input);
  }
}
