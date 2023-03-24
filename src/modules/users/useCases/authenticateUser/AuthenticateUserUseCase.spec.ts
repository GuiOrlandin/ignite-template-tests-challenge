import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });
  it("Should be able to authenticate an user", async () => {
    const user = {
      name: "User Name",
      email: "email@email.com",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
  });

  it("Should not be able to authenticate an nonexistent user", () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "email@email.com",
        password: "123456",
      };

      const userCreated = await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "x",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate an nonexistent user", () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "email@email.com",
        password: "123456",
      };

      const userCreated = await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
