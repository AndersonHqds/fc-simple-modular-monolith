import UsecaseInterface from "../../../@shared/usecase/usecase-interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export default class FindInvoiceUsecase implements UsecaseInterface {
  constructor(private readonly _invoiceRepository: InvoiceGateway) {}

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this._invoiceRepository.find(input.id);

    let items: FindInvoiceUseCaseOutputDTO["items"] = [];
    let total = 0;

    for (const item of invoice.items) {
      items.push({
        id: item.id.id,
        name: item.name,
        price: item.price,
      });
      total += item.price;
    }

    return {
      address: invoice.address,
      document: invoice.document,
      id: invoice.id.id,
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      name: invoice.name,
      createdAt: invoice.createdAt,
      total: total,
    };
  }
}
