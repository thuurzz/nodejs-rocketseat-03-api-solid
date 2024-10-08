import { prisma } from "@/lib/prisma";
import { Prisma } from "prisma/prisma-client";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const { name, email, password_hash } = data;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    });

    return newUser;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
