import UsecaseInterface from "../../@shared/usecase/usecase-interface";
import ProductGateway from "../gateway/product.gateway";
import { FidAllProductsDto } from "./find-all-products.dto";

export default class FindAllProductsUsecase implements UsecaseInterface {
  constructor(private readonly _productRepository: ProductGateway) {}

  async execute(): Promise<FidAllProductsDto> {
    const products = await this._productRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
