import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split("/");

    const createStatement = container.resolve(CreateStatementUseCase);

    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
