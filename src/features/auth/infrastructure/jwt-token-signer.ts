import jwt, { type SignOptions } from "jsonwebtoken";
import { getJwtSecret } from "../../../common/infrastructure/jwt-config.js";
import type { TokenSigner, UserRole } from "../domain/user.js";

export class JwtTokenSigner implements TokenSigner {
  sign(user: { id: string; role: UserRole }): string {
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"];
    return jwt.sign({ role: user.role }, getJwtSecret(), {
      subject: user.id,
      expiresIn,
    });
  }
}
