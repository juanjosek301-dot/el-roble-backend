import { Prisma } from "../../../infrastructure/database/generated/client.js";
import type { PrismaClient } from "../../../infrastructure/database/generated/client.js";
import { EmailAlreadyRegisteredError, type AuthRepository, type User } from "../domain/user.js";

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async create(input: Pick<User, "nombre" | "email" | "passwordHash">): Promise<User> {
    try {
      const user = await this.prisma.user.create({ data: { ...input, role: "user" } });
      return this.toDomain(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new EmailAlreadyRegisteredError();
      }
      throw error;
    }
  }

  private toDomain(user: { id: string; nombre: string; email: string; passwordHash: string; role: string }): User {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role === "admin" ? "admin" : "user",
    };
  }
}
