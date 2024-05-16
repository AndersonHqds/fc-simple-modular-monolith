import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import TransactionFacadeFactory from "../factory/transaction.factory";

describe("Transaction Facade", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment with status DECLIDED when amount is lower than 100", async () => {
    const input = {
      orderId: "1",
      amount: 10,
    };

    const facade = TransactionFacadeFactory.create();

    await facade.process(input);

    const transaction = await TransactionModel.findOne({
      where: { orderId: input.orderId },
    });

    expect(transaction.orderId).toBe(input.orderId);
    expect(transaction.amount).toBe(input.amount);
    expect(transaction.status).toBe("DECLINED");
  });

  it("should process a payment with status APPROVED when amount is greater than 100", async () => {
    const input = {
      orderId: "1",
      amount: 200,
    };

    const facade = TransactionFacadeFactory.create();

    await facade.process(input);

    const transaction = await TransactionModel.findOne({
      where: { orderId: input.orderId },
    });

    expect(transaction.orderId).toBe(input.orderId);
    expect(transaction.amount).toBe(input.amount);
    expect(transaction.status).toBe("APPROVED");
  });

  it("should throw an error when amount is equal to 0", async () => {
    const input = {
      orderId: "1",
      amount: 0,
    };

    const facade = TransactionFacadeFactory.create();

    await expect(facade.process(input)).rejects.toThrowError(
      "Amount must be greater than 0"
    );
  });
});
