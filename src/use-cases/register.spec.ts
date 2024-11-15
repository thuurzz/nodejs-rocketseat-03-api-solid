import { describe, it, expect } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  it("should be able to hash the user password", async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },

      async create(data) {
        return {
          id: "1",
          ...data,
          created_at: new Date(),
        };
      },
    });

    const { newUser } = await registerUseCase.execute({
      name: "John Doe",
      email: "jhondoe@email.com",
      password: "123456",
    });

    const isPasswordHash = await compare("123456", newUser.password_hash);

    expect(newUser.password_hash).not.toBe("123456");
    expect(isPasswordHash).toBe(true);
  });

  it("should not be able to register a user with an already used email", async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return {
          id: "1",
          name: "John Doe",
          email: "jhondoe@email.com",
          password_hash: "123456",
          created_at: new Date(),
        };
      },
      async create(data) {
        return {
          id: "1",
          ...data,
          created_at: new Date(),
        };
      },
    });

    try {
      await registerUseCase.execute({
        name: "John Doe",
        email: "jhondoe@email.com",
        password: "123456",
      });

      await registerUseCase.execute({
        name: "John Doe",
        email: "jhondoe@email.com",
        password: "123456",
      });
    } catch (error: any) {
      expect(error.message).toBe("E-mail already exists.");
    }
  });
});
