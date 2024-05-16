import UsecaseInterface from "../../@shared/usecase/usecase-interface";
import FindInvoiceUsecase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUsecase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private readonly _findInvoiceUsecase: FindInvoiceUsecase,
    private readonly _generateInvoiceUsecase: GenerateInvoiceUsecase
  ) {}

  async generateInvoice(
    data: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    const input = {
      name: data.name,
      document: data.document,
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      city: data.address.city,
      state: data.address.state,
      zipCode: data.address.zipCode,
      items: data.items,
    };

    const invoice = await this._generateInvoiceUsecase.execute(input);

    return {
      id: invoice.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
    };
  }

  findInvoice(id: string): Promise<FindInvoiceFacadeOutputDto> {
    return this._findInvoiceUsecase.execute({ id });
  }
}
