import { Router } from "express";
import { prisma } from "../../../../infrastructure/database/client.js";
import { BcryptPasswordHasher } from "../../infrastructure/bcrypt-password-hasher.js";
import { JwtTokenSigner } from "../../infrastructure/jwt-token-signer.js";
import { PrismaAuthRepository } from "../../infrastructure/prisma-auth.repository.js";
import { LoginUseCase } from "../../application/login.use-case.js";
import { RegisterUseCase } from "../../application/register.use-case.js";
import { AuthController } from "./auth.controller.js";

const repository = new PrismaAuthRepository(prisma);
const passwords = new BcryptPasswordHasher();
const controller = new AuthController(
  new RegisterUseCase(repository, passwords),
  new LoginUseCase(repository, passwords, new JwtTokenSigner()),
);

export const authRouter = Router();
authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);
