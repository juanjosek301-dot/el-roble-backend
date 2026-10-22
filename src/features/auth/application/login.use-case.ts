import { HttpError } from "../../../common/application/http-error.js";
import type { AuthRepository, PasswordHasher, SafeUser, TokenSigner } from "../domain/user.js";

export interface LoginInput {
  email: unknown;
  password: unknown;
}

export interface LoginResult {
  token: string;
  user: SafeUser;
}

export class LoginUseCase {
  constructor(
    private readonly users: AuthRepository,
    private readonly passwords: PasswordHasher,
    private readonly tokens: TokenSigner,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input.password === "string" ? input.password : "";
    const user = email ? await this.users.findByEmail(email) : null;

    if (!user || !(await this.passwords.compare(password, user.passwordHash))) {
      throw new HttpError(401, "El correo o la contraseña no son correctos.");
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return { token: this.tokens.sign(user), user: safeUser };
  }
}
