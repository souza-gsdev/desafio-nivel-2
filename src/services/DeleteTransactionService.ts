import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const existTransaction = await transactionRepository.findOne(id);

    if (!existTransaction) {
      throw new AppError('Transaction does not exists');
    }

    await transactionRepository.remove(existTransaction);

    return;
  }
}

export default DeleteTransactionService;
