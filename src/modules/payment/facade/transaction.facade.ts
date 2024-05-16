import ProcessPaymentUsecase from "../usecase/process-payment/process-payment.usecase";
import TransactionFacadeInterface, {
  TransactionFacadeInputDto,
  TransactionFacadeOutputDto,
} from "./transaction.facade.interface";

export default class TransactionFacade implements TransactionFacadeInterface {
  constructor(private readonly _processPaymentUsecase: ProcessPaymentUsecase) {}

  process(
    input: TransactionFacadeInputDto
  ): Promise<TransactionFacadeOutputDto> {
    return this._processPaymentUsecase.execute(input);
  }
}
