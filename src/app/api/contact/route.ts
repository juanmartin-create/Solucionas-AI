import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  need?: string;
  message?: string;
  website?: string; // honeypot
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-json" }, { status: 400 });
  }

  if (data.website) return NextResponse.json({ ok: true }); // bot: fingir éxito

  const name = (data.name ?? "").trim().slice(0, 200);
  const email = (data.email ?? "").trim().slice(0, 200);
  const company = (data.company ?? "").trim().slice(0, 200);
  const need = (data.need ?? "").trim().slice(0, 100);
  const message = (data.message ?? "").trim().slice(0, 5000);

  if (!name || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? SITE.email;
  const from = process.env.CONTACT_FROM ?? "onboarding@resend.dev";

  if (!key) {
    // Sin proveedor configurado: el cliente abre el mailto.
    return NextResponse.json({ ok: false, reason: "unconfigured" });
  }

  const html = `
    <p><strong>Nombre:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Negocio:</strong> ${esc(company)}</p>
    <p><strong>Necesita:</strong> ${esc(need)}</p>
    <hr />
    <p>${esc(message).replace(/\n/g, "<br />")}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${SITE.fullName} <${from}>`,
      to: [to],
      reply_to: email,
      subject: `Propuesta — ${need || "consulta"} — ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, reason: "provider" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
