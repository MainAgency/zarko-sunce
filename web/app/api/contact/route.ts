import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactPayload = {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const { type, name, email, phone, message } =
      (await request.json()) as ContactPayload;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Ime, e-mail i poruka su obavezni." },
        { status: 400 },
      );
    }

    const senderType = type === "business" ? "Tvrtka" : "Osoba";

    const body = [
      `Tip pošiljatelja: ${senderType}`,
      `Ime: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phone?.trim() || "—"}`,
      "",
      "Poruka:",
      message,
    ].join("\n");

    const { error } = await resend.emails.send({
      from: `Kontakt obrazac <noreply@${process.env.RESEND_DOMAIN}>`,
      to: process.env.RESEND_EMAIL!,
      replyTo: email,
      subject: `Nova poruka s web stranice — ${senderType}: ${name}`,
      text: body,
    });

    if (error) {
      console.error("[contact] resend error:", error);
      return NextResponse.json(
        { error: "Slanje poruke nije uspjelo. Pokušajte ponovno." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    return NextResponse.json(
      { error: "Došlo je do greške. Pokušajte ponovno." },
      { status: 500 },
    );
  }
}
