import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });
  it("Should be able to create a new user", async () => {
    const user = {
      name: "User Name",
      email: "email@email.com",
      password: "123456",
    };

    await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
    });

    const userCreated = await inMemoryUserRepository.findByEmail(user.email);

    expect(userCreated).toHaveProperty("id");
  });
  it("Should be able to create a new user", async () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "email@email.com",
        password: "123456",
      };

      await createUserUseCase.execute({
        email: user.email,
        name: user.name,
        password: user.password,
      });

      await createUserUseCase.execute({
        email: user.email,
        name: user.name,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
