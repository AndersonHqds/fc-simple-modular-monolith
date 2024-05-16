import { Sequelize } from "sequelize-typescript";
import InvoiceFactory from "../factory/invoice.facade.factory";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceModel from "../repository/invoice.model";

describe("InvoiceFacade unit test", () => {
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

  it("should find an invoice by id", async () => {
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

    const facade = InvoiceFactory.create();
    const invoice = await facade.findInvoice("1");
    expect(invoice.id).toBe("1");
    expect(invoice.name).toBe("Invoice name");
    expect(invoice.document).toBe("Invoice document");
    expect(invoice.total).toBe(100);
    expect(invoice.address.city).toBe("Invoice city");
    expect(invoice.address.complement).toBe("Invoice complement");
    expect(invoice.address.number).toBe("1");
    expect(invoice.address.state).toBe("Invoice state");
    expect(invoice.address.street).toBe("Invoice street");
    expect(invoice.address.zipCode).toBe("Invoice zipCode");
    expect(invoice.items[0].id).toBe("1");
    expect(invoice.items[0].name).toBe("Invoice item name");
    expect(invoice.items[0].price).toBe(100);
  });

  it("should generate an invoice", async () => {
    const facade = InvoiceFactory.create();
    const invoice = await facade.generateInvoice({
      name: "Invoice name",
      document: "Invoice document",
      address: {
        street: "Invoice street",
        number: "1",
        complement: "Invoice complement",
        city: "Invoice city",
        state: "Invoice state",
        zipCode: "Invoice zipCode",
      },
      items: [
        {
          id: "1",
          name: "Invoice item name",
          price: 100,
        },
      ],
    });

    expect(invoice.id).toStrictEqual(expect.any(String));
    expect(invoice.name).toBe("Invoice name");
    expect(invoice.document).toBe("Invoice document");
    expect(invoice.total).toBe(100);
    expect(invoice.address.city).toBe("Invoice city");
    expect(invoice.address.complement).toBe("Invoice complement");
    expect(invoice.address.number).toBe("1");
    expect(invoice.address.state).toBe("Invoice state");
    expect(invoice.address.street).toBe("Invoice street");
    expect(invoice.address.zipCode).toBe("Invoice zipCode");
    expect(invoice.items[0].id).toBe("1");
    expect(invoice.items[0].name).toBe("Invoice item name");
    expect(invoice.items[0].price).toBe(100);
  });
});
