import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
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

    expect(deposit).toHaveProperty("id");
  });

  it("Should be able to withdraw", async () => {
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

    const withdraw = await createStatementUseCase.execute({
      user_id: userCreated.id as string,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: "Deposito",
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("Should not be able to withdraw", async () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "email@email.com",
        password: "123456",
      };

      const userCreated = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: userCreated.id as string,
        amount: 200,
        type: OperationType.WITHDRAW,
        description: "saque",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
