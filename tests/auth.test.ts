import { describe, expect, it } from "vitest";

import { isOwnerEmail } from "../lib/auth";

describe("isOwnerEmail", () => {
  const owner = "ulisescerda41@gmail.com";

  it("acepta el correo del dueño", () => {
    expect(isOwnerEmail("ulisescerda41@gmail.com", owner)).toBe(true);
  });

  it("ignora mayúsculas y espacios", () => {
    expect(isOwnerEmail("  UlisesCerda41@Gmail.com ", owner)).toBe(true);
  });

  it("rechaza cualquier otro correo", () => {
    expect(isOwnerEmail("otra@persona.com", owner)).toBe(false);
  });

  it("rechaza correos vacíos o ausentes", () => {
    expect(isOwnerEmail("", owner)).toBe(false);
    expect(isOwnerEmail(null, owner)).toBe(false);
    expect(isOwnerEmail(undefined, owner)).toBe(false);
  });

  it("rechaza todo si OWNER_EMAIL no está configurado", () => {
    expect(isOwnerEmail("ulisescerda41@gmail.com", "")).toBe(false);
    expect(isOwnerEmail("ulisescerda41@gmail.com", undefined)).toBe(false);
  });
});
