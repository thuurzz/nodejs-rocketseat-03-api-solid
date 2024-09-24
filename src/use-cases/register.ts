import { prisma } from "@/lib/prisma";
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
  const emailAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailAlreadyExists) throw new Error("E-mail already exists");

  const password_hash = await hash(password, 6);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });

  return newUser;
}
