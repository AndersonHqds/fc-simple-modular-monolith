import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUsecase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 100,
  stock: 10,
});

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(product)),
});

describe("CheckStockUsecase", () => {
  it("should get stock of a product", async () => {
    const repository = MockRepository();
    const checkStockUsecase = new CheckStockUsecase(repository);
    const input = {
      productId: "1",
    };
    const result = await checkStockUsecase.execute(input);
    expect(repository.find).toBeCalledWith(input.productId);
    expect(result.productId).toBe("1");
    expect(result.stock).toBe(10);
  });
});
