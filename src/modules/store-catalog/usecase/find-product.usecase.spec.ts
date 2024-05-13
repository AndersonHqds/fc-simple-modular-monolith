import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import FindProductUsecase from "./find-product.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
});

const MockRepository = () => ({
  find: jest.fn().mockReturnValue(Promise.resolve(product)),
  findAll: jest.fn(),
});

describe("Find a product usecase unit test", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const usecase = new FindProductUsecase(productRepository);
    const input = {
      id: "1",
    };
    const result = await usecase.execute(input);

    expect(productRepository.find).toBeCalledWith(input.id);
    expect(result.id).toBe("1");
  });
});
