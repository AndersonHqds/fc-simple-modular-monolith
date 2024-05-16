import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import Invoice from "../domain/invoice";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItems from "../domain/invoice-items";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("InvoiceRepository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice name",
        document: "Invoice document",
        street: "Invoice street",
        number: "1",
        complement: "Invoice complement",
        city: "Invoice city",
        state: "Invoice state",
        zipCode: "Invoice zipCode",
        items: [
          {
            id: "1",
            name: "Invoice item name",
            price: 100,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [InvoiceItemsModel] }
    );

    const repository = new InvoiceRepository();
    const invoice = await repository.find("1");

    expect(invoice.id.id).toBe("1");
    expect(invoice.name).toBe("Invoice name");
    expect(invoice.document).toBe("Invoice document");
    expect(invoice.address.city).toBe("Invoice city");
    expect(invoice.address.complement).toBe("Invoice complement");
    expect(invoice.address.number).toBe("1");
    expect(invoice.address.state).toBe("Invoice state");
    expect(invoice.address.street).toBe("Invoice street");
    expect(invoice.address.zipCode).toBe("Invoice zipCode");
    expect(invoice.items[0].id.id).toBe("1");
    expect(invoice.items[0].name).toBe("Invoice item name");
    expect(invoice.items[0].price).toBe(100);
  });

  it("should throw an error when invoice not found", async () => {
    const repository = new InvoiceRepository();
    await expect(repository.find("1")).rejects.toThrowError(
      "Invoice with id 1 not found"
    );
  });

  it("should save an invoice", async () => {
    const repository = new InvoiceRepository();
    const address = new Address({
      city: "Invoice city",
      complement: "Invoice complement",
      number: "1",
      state: "Invoice state",
      street: "Invoice street",
      zipCode: "Invoice zipCode",
    });
    const invoiceItems = [
      new InvoiceItems({
        id: new Id("1"),
        name: "Invoice item name",
        price: 100,
      }),
    ];
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice name",
      document: "Invoice document",
      address,
      items: invoiceItems,
    });

    await repository.save(invoice);
    const invoiceFound = await InvoiceModel.findOne({
      include: [InvoiceItemsModel],
      where: { id: "1" },
    });

    expect(invoiceFound.id).toBe("1");
    expect(invoiceFound.name).toBe("Invoice name");
    expect(invoiceFound.document).toBe("Invoice document");
    expect(invoiceFound.city).toBe("Invoice city");
    expect(invoiceFound.complement).toBe("Invoice complement");
    expect(invoiceFound.number).toBe("1");
    expect(invoiceFound.state).toBe("Invoice state");
    expect(invoiceFound.street).toBe("Invoice street");
    expect(invoiceFound.zipCode).toBe("Invoice zipCode");
    expect(invoiceFound.items[0].id).toBe("1");
    expect(invoiceFound.items[0].name).toBe("Invoice item name");
    expect(invoiceFound.items[0].price).toBe(100);
  });
});
