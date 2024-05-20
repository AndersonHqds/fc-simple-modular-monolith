import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UsecaseInterface from "../../../@shared/usecase/usecase-interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import TransactionFacadeInterface from "../../../payment/facade/transaction.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUsecase implements UsecaseInterface {
  constructor(
    private readonly _clientFacade: ClientAdmFacadeInterface,
    private readonly _productFacade: ProductAdmFacadeInterface,
    private readonly _catalogFacade: StoreCatalogFacadeInterface,
    private readonly _checkoutRepository: CheckoutGateway,
    private readonly _invoiceFacade: InvoiceFacadeInterface,
    private readonly _paymentFacade: TransactionFacadeInterface
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.findClient({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validateProducts(input);

    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    const clientPayer = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address({
        city: client.address.city,
        complement: client.address.complement,
        number: client.address.number,
        state: client.address.state,
        street: client.address.street,
        zipCode: client.address.zipCode,
      }),
    });

    const order = new Order({
      client: clientPayer,
      products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generateInvoice({
            name: client.name,
            document: client.document,
            address: client.address,
            items: products.map((p) => ({
              id: p.id.id,
              name: p.name,
              price: p.salesPrice,
            })),
          })
        : null;

    payment.status === "approved" && order.approved();
    this._checkoutRepository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.id,
      })),
    };
    // recuperar os produtos
    // criar o objeto do cliente
    // criar o objeto da order (client, products)
    // processar pagamento -> paymentfacade.process (orderid, amout)
    // caso pagamento seja aprovado. -> Gerar invoice
    // mudar o status da minha order para approved
    // retornar dto
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const eachProduct of input.products) {
      const product = await this._productFacade.checkStock({
        productId: eachProduct.productId,
      });

      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    return new Product({
      id: new Id(productId),
      description: product.description,
      name: product.name,
      salesPrice: product.salesPrice,
    });
  }
}
