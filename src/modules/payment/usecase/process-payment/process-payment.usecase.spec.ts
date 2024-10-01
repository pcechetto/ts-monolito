import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUsecase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
  status: "approved",
});

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  };
};

const transaction2 = new Transaction({
  id: new Id("2"),
  amount: 50,
  orderId: "2",
  status: "declined",
});

const MockRepository2 = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction2)),
  };
};

describe("process payment usecase unit test", () => {
  it("should approve a payment", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUsecase(paymentRepository);
    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await usecase.execute(input);

    expect(result.transactionId).toBe(transaction.id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(input.amount);
    expect(result.status).toBe("approved");
    expect(result.createdAt).toBe(transaction.createdAt);
    expect(result.updatedAt).toBe(transaction.updatedAt);
  });

  it("should decline a payment", async () => {
    const paymentRepository = MockRepository2();
    const usecase = new ProcessPaymentUsecase(paymentRepository);
    const input = {
      orderId: "2",
      amount: 50,
    };

    const result = await usecase.execute(input);

    expect(result.transactionId).toBe(transaction2.id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(input.amount);
    expect(result.status).toBe("declined");
    expect(result.createdAt).toBe(transaction2.createdAt);
    expect(result.updatedAt).toBe(transaction2.updatedAt);
  });
});
