import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUsecase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
});

const MockRepository = () => ({
  save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
});

describe("Process payment usecase test", () => {
  it("should process a payment", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUsecase(paymentRepository);
    const input = {
      orderId: "1",
      amount: 100,
    };
    const result = await usecase.execute(input);

    expect(paymentRepository.save).toBeCalled();
    expect(result.transactionId).toBe("1");
    expect(result.orderId).toBe("1");
    expect(result.amount).toBe(100);
    expect(result.status).toBe("APPROVED");
  });
});
