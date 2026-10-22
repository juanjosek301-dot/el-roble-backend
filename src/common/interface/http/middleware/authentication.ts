import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { HttpError } from "../../../application/http-error.js";
import { getJwtSecret } from "../../../infrastructure/jwt-config.js";
import type { UserRole } from "../../../../features/auth/domain/user.js";

export interface AuthenticatedUser {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedUser;
    }
  }
}

export function authenticate(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    next(new HttpError(401, "Debes iniciar sesión para acceder a este recurso."));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const role = payload.role;
    if (typeof payload.sub !== "string" || (role !== "admin" && role !== "user")) {
      next(new HttpError(401, "El token de acceso no es válido."));
      return;
    }

    request.auth = { userId: payload.sub, role };
    next();
  } catch {
    next(new HttpError(401, "El token de acceso no es válido o ha expirado."));
  }
}

export function requireRole(requiredRole: UserRole) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.auth) {
      next(new HttpError(401, "Debes iniciar sesión para acceder a este recurso."));
      return;
    }
    if (request.auth.role !== requiredRole) {
      next(new HttpError(403, "No tienes permisos para realizar esta acción."));
      return;
    }
    next();
  };
}
