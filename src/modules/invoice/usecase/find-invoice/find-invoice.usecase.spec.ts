import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import FindInvoiceUsecase from "./find-invoice.usecase";

const invoiceItems = new InvoiceItems({
  name: "Invoice item name",
  price: 100,
  id: new Id("1"),
});

const invoice = new Invoice({
  name: "Invoice name",
  document: "Invoice document",
  address: new Address({
    city: "Invoice city",
    complement: "Invoice complement",
    number: "1",
    state: "Invoice state",
    street: "Invoice street",
    zipCode: "Invoice zipCode",
  }),
  items: [invoiceItems],
  id: new Id("1"),
});

const MockRepository = () => ({
  find: jest.fn().mockReturnValue(invoice),
  save: jest.fn(),
});

describe("FindInvoiceUsecase", () => {
  it("should find an invoice by id", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUsecase(repository);
    const invoice = await usecase.execute({ id: "1" });
    expect(repository.find).toBeCalledWith("1");
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
});
