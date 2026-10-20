import { NextResponse, type NextRequest } from "next/server";

import { isOwnerEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const base = (process.env.APP_URL ?? origin).replace(/\/$/, "");
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isOwnerEmail(user?.email)) {
        return NextResponse.redirect(`${base}/hoy`);
      }

      await supabase.auth.signOut();
      return NextResponse.redirect(`${base}/login?error=no_autorizado`);
    }
  }

  return NextResponse.redirect(`${base}/login?error=enlace_invalido`);
}
