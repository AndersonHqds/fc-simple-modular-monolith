import ProductAdmFacade from "../facade/product-adm";
import ProductRepository from "../repository/product.repository";
import AddProductUsecase from "../usecase/add-product/add-product.usecase";
import CheckStockUsecase from "../usecase/check-stock/check-stock.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUsecase = new AddProductUsecase(productRepository);
    const checkStockUsecase = new CheckStockUsecase(productRepository);
    const productFacade = new ProductAdmFacade(
      addProductUsecase,
      checkStockUsecase
    );
    return productFacade;
  }
}
