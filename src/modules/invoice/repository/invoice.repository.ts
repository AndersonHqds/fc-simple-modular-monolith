import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItems from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      include: [InvoiceItemsModel],
      where: { id },
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      address: new Address({
        city: invoice.city,
        complement: invoice.complement,
        number: invoice.number,
        state: invoice.state,
        street: invoice.street,
        zipCode: invoice.zipCode,
      }),
      document: invoice.document,
      items: invoice.items.map(
        (item) =>
          new InvoiceItems({
            name: item.name,
            price: item.price,
            id: new Id(item.id),
          })
      ),
      name: invoice.name,
      id: new Id(invoice.id),
      createdAt: invoice.createdAt,
    });
  }
  async save(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        city: invoice.address.city,
        complement: invoice.address.complement,
        number: invoice.address.number,
        state: invoice.address.state,
        street: invoice.address.street,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
      },
      { include: [InvoiceItemsModel] }
    );
  }
}
