export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET debe estar configurado con al menos 32 caracteres.");
  }
  return secret;
}
