import { env } from "@/env";
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { pino } from "pino";

export async function errorHandler(
  error: Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const isDevelopment = env.NODE_ENV !== "production";

  const log = pino({
    level: process.env.PINO_LOG_LEVEL || "info",
    formatters: {
      bindings: (bindings) => {
        return { pid: bindings.pid, host: bindings.hostname };
      },
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isDevelopment && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: true,
          singleLine: false,
        },
      },
    }),
  });

  if (isDevelopment) {
    log.error(error);
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation Error",
      issues: error.format(),
    });
  }

  return reply.status(500).send({
    message: "Internal server error.",
  });
}
