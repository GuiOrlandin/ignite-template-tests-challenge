import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });
  it("Should be able to get balance", async () => {
    const user = {
      name: "User Name",
      email: "email@email.com",
      password: "123456",
    };

    const userCreated = await createUserUseCase.execute(user);

    const checkUserAndGetBalance = await getBalanceUseCase.execute({
      user_id: userCreated.id as string,
    });

    expect(checkUserAndGetBalance).toHaveProperty("balance");
  });

  it("Should not be able to show an user", async () => {
    expect(async () => {
      const userProfileCheck = await getBalanceUseCase.execute({
        user_id: "id not existent",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
