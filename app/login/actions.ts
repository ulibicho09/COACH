"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { isOwnerEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "sent" | "error";
  message: string;
};

const emailSchema = z.string().trim().email("Escribe un correo válido.");

async function getBaseUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Correo inválido." };
  }

  const email = parsed.data;

  if (!isOwnerEmail(email)) {
    return { status: "error", message: "Este correo no tiene acceso a Coach." };
  }

  const supabase = await createClient();
  const baseUrl = await getBaseUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${baseUrl}/auth/callback` },
  });

  if (error) {
    return {
      status: "error",
      message: "No se pudo enviar el enlace. Intenta de nuevo en unos minutos.",
    };
  }

  return { status: "sent", message: "Listo. Revisa tu correo y abre el enlace para entrar." };
}
