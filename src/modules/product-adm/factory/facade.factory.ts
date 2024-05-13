import ProductAdmFacade from "../facade/product-adm";
import ProductRepository from "../repository/product.repository";
import AddProductUsecase from "../usecase/add-product/add-product.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUsecase = new AddProductUsecase(productRepository);
    const productFacade = new ProductAdmFacade(addProductUsecase, undefined);
    return productFacade;
  }
}
