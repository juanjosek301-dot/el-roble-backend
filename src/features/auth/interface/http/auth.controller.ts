import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../../../../common/application/http-error.js";
import { EmailAlreadyRegisteredError } from "../../domain/user.js";
import { LoginUseCase } from "../../application/login.use-case.js";
import { RegisterUseCase } from "../../application/register.use-case.js";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUseCase,
    private readonly loginUser: LoginUseCase,
  ) {}

  register = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = await this.registerUser.execute(request.body ?? {});
      response.status(201).json({ message: "Cuenta creada correctamente.", user });
    } catch (error) {
      next(error instanceof EmailAlreadyRegisteredError ? new HttpError(409, error.message) : error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await this.loginUser.execute(request.body ?? {}));
    } catch (error) {
      next(error);
    }
  };
}
