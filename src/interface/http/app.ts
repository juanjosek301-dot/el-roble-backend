import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes.js";

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "1mb" }));
  app.use("/api/health", healthRouter);

  return app;
}
