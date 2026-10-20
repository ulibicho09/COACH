import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { LoginForm } from "./login-form";

const ERRORS: Record<string, string> = {
  no_autorizado: "Ese correo no tiene acceso a Coach.",
  enlace_invalido: "El enlace expiró o ya se usó. Pide uno nuevo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERRORS[error] : undefined;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Coach</CardTitle>
          <CardDescription>
            Escribe tu correo y te enviaré un enlace para entrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {errorMessage ? (
            <p role="alert" className="rounded-lg bg-muted px-4 py-3 text-sm font-medium">
              {errorMessage}
            </p>
          ) : null}
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
