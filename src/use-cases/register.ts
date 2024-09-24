import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const userRepository = new PrismaUsersRepository();

  const emailAlreadyExists = await userRepository.findByEmail(email);

  if (emailAlreadyExists) throw new Error("E-mail already exists");

  const password_hash = await hash(password, 6);

  const newUser = await userRepository.create({
    name,
    email,
    password_hash,
  });

  return newUser;
}
