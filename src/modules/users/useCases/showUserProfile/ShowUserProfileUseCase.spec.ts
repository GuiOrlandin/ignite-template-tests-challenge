import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileError: ShowUserProfileUseCase;

describe("Show User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileError = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });
  it("Should be able to show an user", async () => {
    const user = {
      name: "User Name",
      email: "email@email.com",
      password: "123456",
    };

    const UserCreated = await createUserUseCase.execute(user);

    const userProfileCheck = await showUserProfileError.execute(
      UserCreated.id as string
    );

    expect(userProfileCheck).toHaveProperty("id");
  });

  it("Should not be able to show an user", async () => {
    expect(async () => {
      const userProfileCheck = await showUserProfileError.execute(
        "id not existent"
      );
    }).rejects.toBeInstanceOf(AppError);
  });
});
