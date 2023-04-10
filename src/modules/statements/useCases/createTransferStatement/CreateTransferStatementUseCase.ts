import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { OperationType } from "../../entities/Statement";

export interface ICreateTransferStatementDTO {
  sender_id: string;
  receiver_id: string;
  description: string;
  amount: number;
}

@injectable()
export class CreateTransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    description,
    sender_id,
    receiver_id,
  }: ICreateTransferStatementDTO) {
    const user = await this.usersRepository.findById(sender_id);
    const sender = await this.usersRepository.findById(receiver_id);

    if (!sender) {
      throw new CreateStatementError.UserNotFound();
    }

    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const type = "transfer" as OperationType;

    const statementOperation = await this.statementsRepository.create({
      type,
      user_id: receiver_id,
      amount,
      description,
      sender_id,
    });

    return statementOperation;
  }
}
