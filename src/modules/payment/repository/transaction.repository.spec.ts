import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import TransactionRepository from "./transaction.repository";
import Transaction from "../domain/transaction";

describe("TransactionRepository unit test", () => {
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

  it("should save a transaction", async () => {
    const input = {
      id: new Id("1"),
      amount: 10,
      orderId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const transaction = new Transaction(input);
    transaction.approve();
    const repository = new TransactionRepository();
    const result = await repository.save(transaction);

    expect(result.id.id).toBe(transaction.id.id);
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.status).toBe("APPROVED");
    expect(result.createdAt).toStrictEqual(transaction.createdAt);
    expect(result.updatedAt).toStrictEqual(transaction.updatedAt);
  });
});
