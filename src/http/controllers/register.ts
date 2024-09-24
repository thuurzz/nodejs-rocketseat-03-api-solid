import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { registerUseCase } from "@/use-cases/register";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  try {
    const { name, email, password } = bodySchema.parse(request.body);
    const newUser = await registerUseCase({ name, email, password });
    return reply.status(201).send(newUser);
  } catch (error) {
    return reply.status(409).send();
  }
}
