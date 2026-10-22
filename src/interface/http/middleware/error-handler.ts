import type { ErrorRequestHandler } from "express";
import { HttpError } from "../../../features/productos/application/errors.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ message: "El cuerpo de la solicitud no contiene JSON válido." });
    return;
  }

  console.error(error);
  response.status(500).json({ message: "Ocurrió un error interno en el servidor." });
};
