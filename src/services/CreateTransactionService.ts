import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    let existsCategory = await categoryRepository.findOne({
      where: { title: category }
    });

    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (!existsCategory) {
      existsCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(existsCategory);
    }

    if (type === 'outcome') {
      const { total } = await transactionRepository.getBalance();
      if (value > total) {
        throw new AppError('Insufficient funds');
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: existsCategory.id
    });

    await transactionRepository.save(transaction);

    return transaction;


  }
}

export default CreateTransactionService;
