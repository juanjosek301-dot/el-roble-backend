export type UserRole = "admin" | "user";

export interface User {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface SafeUser extends Omit<User, "passwordHash"> {}

export interface AuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(input: Pick<User, "nombre" | "email" | "passwordHash">): Promise<User>;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface TokenSigner {
  sign(user: Pick<User, "id" | "role">): string;
}

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Ya existe una cuenta con ese correo.");
    this.name = "EmailAlreadyRegisteredError";
  }
}
