/**
 * Coach es una app de un solo usuario. Solo el correo definido en
 * OWNER_EMAIL puede entrar.
 */
export function isOwnerEmail(
  email: string | null | undefined,
  owner: string | undefined = process.env.OWNER_EMAIL,
): boolean {
  const expected = owner?.trim().toLowerCase();
  const received = email?.trim().toLowerCase();
  if (!expected || !received) return false;
  return expected === received;
}
