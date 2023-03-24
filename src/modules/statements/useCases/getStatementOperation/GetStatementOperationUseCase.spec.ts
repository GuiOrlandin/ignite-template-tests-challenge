import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });
  it("Should be able to create a new deposit", async () => {
    const user = {
      name: "User Name",
      email: "email@email.com",
      password: "123456",
    };

    const userCreated = await createUserUseCase.execute(user);

    const deposit = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      amount: 200,
      type: OperationType.DEPOSIT,
      description: "Deposito",
    });

    const statementOperationCheck = await getStatementOperationUseCase.execute({
      user_id: userCreated.id as string,
      statement_id: deposit.id as string,
    });

    expect(statementOperationCheck).toHaveProperty("id");
  });

  it("Should not be able to withdraw", async () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "email@email.com",
        password: "123456",
      };

      const userCreated = await createUserUseCase.execute(user);

      const statementOperationCheck =
        await getStatementOperationUseCase.execute({
          user_id: userCreated.id as string,
          statement_id: "Id non existent",
        });
    }).rejects.toBeInstanceOf(AppError);
  });
});
