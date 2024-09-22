import { app } from "./app";
import { env } from "../src/env";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log(
      `🚀 HTTP Server Running - ${env.NODE_ENV} ! on: http://localhost:${env.PORT}`
    );
  });
