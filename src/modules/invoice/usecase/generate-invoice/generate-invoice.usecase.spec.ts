import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const MockRepository = () => ({
  save: jest.fn().mockReturnValue({
    id: "1",
    name: "Invoice name",
    document: "Invoice document",
    total: 100,
    address: {
      city: "Invoice city",
      complement: "Invoice complement",
      number: "1",
      state: "Invoice state",
      street: "Invoice street",
      zipCode: "Invoice zipCode",
    },
    items: [
      {
        id: "1",
        name: "Invoice item name",
        price: 100,
      },
    ],
  }),
  find: jest.fn(),
});

describe("GenerateInvoiceUsecase", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(repository);
    const invoice = await usecase.execute({
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
    });

    expect(repository.save).toBeCalled();
    expect(invoice.id).toStrictEqual(expect.any(String));
    expect(invoice.name).toBe("Invoice name");
    expect(invoice.document).toBe("Invoice document");
    expect(invoice.total).toBe(100);
    expect(invoice.city).toBe("Invoice city");
    expect(invoice.complement).toBe("Invoice complement");
    expect(invoice.number).toBe("1");
    expect(invoice.state).toBe("Invoice state");
    expect(invoice.street).toBe("Invoice street");
    expect(invoice.zipCode).toBe("Invoice zipCode");
    expect(invoice.items[0].id).toBe("1");
    expect(invoice.items[0].name).toBe("Invoice item name");
    expect(invoice.items[0].price).toBe(100);
  });
});
