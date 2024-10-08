import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { name, email, password } = bodySchema.parse(request.body);

    const newUser = await registerUseCase.execute({ name, email, password });

    return reply.status(201).send(newUser);
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send();
    }

    throw error;
  }
}
