import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

export class CreateTransferStatementController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;

    const createTransferStatement = container.resolve(
      CreateTransferStatementUseCase
    );

    const statement = await createTransferStatement.execute({
      sender_id,
      amount,
      description,
      receiver_id,
    });

    return response.status(201).json(statement);
  }
}
