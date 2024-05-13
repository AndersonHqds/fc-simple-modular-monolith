import {
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "../../facade/product-adm.interface";
import ProductGateway from "../../gateway/product.gateway";

export default class CheckStockUsecase {
  constructor(private readonly _productGateway: ProductGateway) {}

  async execute(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    const product = await this._productGateway.find(input.productId);

    return {
      productId: product.id.id,
      stock: product.stock,
    };
  }
}
