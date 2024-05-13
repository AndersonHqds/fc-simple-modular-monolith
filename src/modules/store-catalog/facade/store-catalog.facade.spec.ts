import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("StoreCatalogFacade", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    });

    const facade = StoreCatalogFacadeFactory.create();
    const product = await facade.find({ id: "1" });

    expect(product).toEqual({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    });
  });

  it("should find all products", async () => {
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    });
    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      salesPrice: 20,
    });

    const facade = StoreCatalogFacadeFactory.create();
    const products = await facade.findAll();

    expect(products).toEqual({
      products: [
        {
          id: "1",
          name: "Product 1",
          description: "Description 1",
          salesPrice: 10,
        },
        {
          id: "2",
          name: "Product 2",
          description: "Description 2",
          salesPrice: 20,
        },
      ],
    });
  });
});
