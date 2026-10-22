import { HttpError } from "../../../common/application/http-error.js";
import type { AuthRepository, PasswordHasher, SafeUser } from "../domain/user.js";

export interface RegisterInput {
  nombre: unknown;
  email: unknown;
  password: unknown;
}

export class RegisterUseCase {
  constructor(
    private readonly users: AuthRepository,
    private readonly passwords: PasswordHasher,
  ) {}

  async execute(input: RegisterInput): Promise<SafeUser> {
    const nombre = typeof input.nombre === "string" ? input.nombre.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const password = typeof input.password === "string" ? input.password : "";

    if (nombre.length < 3 || nombre.length > 100) {
      throw new HttpError(400, "El nombre debe tener entre 3 y 100 caracteres.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new HttpError(400, "Ingresa un correo electrónico válido.");
    }
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres y no exceder 72 bytes.");
    }
    if (await this.users.findByEmail(email)) {
      throw new HttpError(409, "Ya existe una cuenta con ese correo.");
    }

    const user = await this.users.create({
      nombre,
      email,
      passwordHash: await this.passwords.hash(password),
    });
    return this.toSafeUser(user);
  }

  private toSafeUser(user: Awaited<ReturnType<AuthRepository["create"]>>): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
