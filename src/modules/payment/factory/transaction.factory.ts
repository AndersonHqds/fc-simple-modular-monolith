import TransactionFacade from "../facade/transaction.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUsecase from "../usecase/process-payment/process-payment.usecase";

export default class TransactionFacadeFactory {
  static create() {
    const transactionRepository = new TransactionRepository();
    const processPaymentUsecase = new ProcessPaymentUsecase(
      transactionRepository
    );
    const transactionFacade = new TransactionFacade(processPaymentUsecase);
    return transactionFacade;
  }
}
