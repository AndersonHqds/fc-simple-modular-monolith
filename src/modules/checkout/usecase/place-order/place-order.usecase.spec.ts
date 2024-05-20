import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUsecase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUsecase unit test", () => {
  describe("validateProduct method", () => {
    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };
      //@ts-expect-error
      const placeOrderUsecase = new PlaceOrderUsecase();

      await expect(
        //@ts-expect-error - private method
        placeOrderUsecase.validateProducts(input)
      ).rejects.toThrowError("No products selected");
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        ),
      };

      //@ts-expect-error
      const placeOrderUsecase = new PlaceOrderUsecase(
        undefined,
        mockProductFacade
      );

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };
      await expect(
        //@ts-expect-error - private method
        placeOrderUsecase.validateProducts(input)
      ).rejects.toThrowError("Product 1 is not available in stock");

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        //@ts-expect-error - private method
        placeOrderUsecase.validateProducts(input)
      ).rejects.toThrowError("Product 1 is not available in stock");
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      const placeOrderUsecase = new PlaceOrderUsecase(
        undefined,
        undefined,
        //@ts-expect-error
        mockCatalogFacade
      );
      //@ts-expect-error
      await expect(placeOrderUsecase.getProduct("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "1",
          description: "Product description",
          name: "Product name",
          salesPrice: 100,
        }),
      };
      const placeOrderUsecase = new PlaceOrderUsecase(
        undefined,
        undefined,
        //@ts-expect-error
        mockCatalogFacade
      );

      //@ts-expect-error
      const product = await placeOrderUsecase.getProduct("1");

      expect(product.id.id).toBe("1");
      expect(product.description).toBe("Product description");
      expect(product.name).toBe("Product name");
      expect(product.salesPrice).toBe(100);
    });
  });

  describe("Execute Method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(null),
      };
      //@ts-expect-error - no params in constructor
      const placeOrderUsecase = new PlaceOrderUsecase(mockClientFacade);

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
        "Client not found"
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue({}),
      };
      //@ts-expect-error - no params in constructor
      const placeOrderUsecase = new PlaceOrderUsecase(mockClientFacade);

      const mockValidateProduct = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, "validateProducts")
        //@ts-expect-error - no return value
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUsecase.execute(input)).rejects.toThrow(
        new Error("No products selected")
      );

      expect(mockValidateProduct).toHaveBeenCalledTimes(1);
    });

    describe("place an order", () => {
      const clientProps = {
        id: "1",
        name: "Client name",
        document: "000",
        email: "client@user.com",
        address: {
          city: "City 1",
          state: "State 1",
          zipCode: "000",
          street: "Street 1",
          number: "1",
          complement: "",
        },
      };

      const mockClientFacade = {
        findClient: jest.fn().mockResolvedValue(clientProps),
      };

      const mockPaymentFacade = {
        process: jest.fn(),
      };

      const mockCheckoutRepository = {
        addOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        generateInvoice: jest.fn().mockResolvedValue({
          id: "1i",
        }),
      };

      const placeOrderUsecase = new PlaceOrderUsecase(
        mockClientFacade as any,
        null,
        null,
        mockCheckoutRepository as any,
        mockInvoiceFacade as any,
        mockPaymentFacade
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          description: "Product description",
          name: "Product 1",
          salesPrice: 40,
        }),
        "2": new Product({
          id: new Id("2"),
          description: "Product description",
          name: "Product 2",
          salesPrice: 30,
        }),
      };

      const mockValidateProducts = jest
        // @ts-expect-error
        .spyOn(placeOrderUsecase, "validateProducts")
        // @ts-expect-error
        .mockResolvedValue(null);

      const mockGetProduct = jest
        // @ts-expect-error
        .spyOn(placeOrderUsecase, "getProduct")
        .mockImplementation(
          // @ts-expect-error - not return never
          (productId: keyof typeof products) => products[productId]
        );

      it("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUsecase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });

        expect(mockInvoiceFacade.generateInvoice).not.toHaveBeenCalled();
      });

      it("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUsecase.execute(input);

        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: "1" },
          { productId: "2" },
        ]);
        expect(mockClientFacade.findClient).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.findClient).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          address: clientProps.address,
          items: [
            {
              id: "1",
              name: "Product 1",
              price: 40,
            },
            {
              id: "2",
              name: "Product 2",
              price: 30,
            },
          ],
        });
      });
    });
  });
});
