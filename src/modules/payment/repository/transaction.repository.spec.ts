import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";
import Transaction from "../domain/transaction";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("transaction repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a transaction", async () => {
    const transactionRepository = new TransactionRepository();
    const transaction = new Transaction({
      id: new Id("1"),
      orderId: "1",
      amount: 100,
    });
    transaction.approve();

    const result = await transactionRepository.save(transaction);

    expect(result.id.id).toBeDefined();
    expect(result.id.id).toEqual(transaction.id.id);
    expect(result.orderId).toEqual(transaction.orderId);
    expect(result.amount).toEqual(transaction.amount);
    expect(result.status).toEqual("approved");
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});
