export interface TransactionFacadeInputDto {
  orderId: string;
  amount: number;
}

export interface TransactionFacadeOutputDto {
  transactionId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface TransactionFacadeInterface {
  process(
    input: TransactionFacadeInputDto
  ): Promise<TransactionFacadeOutputDto>;
}
