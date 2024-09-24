import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists) throw new Error("E-mail already exists");

    const password_hash = await hash(password, 6);

    const newUser = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return newUser;
  }
}
