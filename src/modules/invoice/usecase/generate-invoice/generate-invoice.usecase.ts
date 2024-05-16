import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UsecaseInterface from "../../../@shared/usecase/usecase-interface";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.dto";

export default class GenerateInvoiceUsecase implements UsecaseInterface {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoiceItems = input.items.map((item) => {
      return new InvoiceItems({
        name: item.name,
        price: item.price,
        id: new Id(item.id),
      });
    });

    const total = invoiceItems.reduce((acc, item) => acc + item.price, 0);

    const address = new Address({
      city: input.city,
      complement: input.complement,
      number: input.number,
      state: input.state,
      street: input.street,
      zipCode: input.zipCode,
    });

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: address,
      items: invoiceItems,
    });

    await this._invoiceRepository.save(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: total,
      city: address.city,
      complement: address.complement,
      number: address.number,
      state: address.state,
      street: address.street,
      zipCode: address.zipCode,
    };
  }
}
