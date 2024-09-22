import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { User } from "@prisma/client";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = bodySchema.parse(request.body);

  const emailAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (emailAlreadyExists) return reply.status(409).send();

  const password_hash = await hash(password, 6);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });

  return reply.status(201).send(newUser);
}
