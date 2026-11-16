import { createTransport } from "nodemailer";
import { CONTACT_EMAIL, type ContactSubmission } from "./contact";

export async function sendContactEmail(submission: ContactSubmission): Promise<void> {
  const password = process.env["GMAIL_APP_PASSWORD"]?.replace(/\s/g, "");
  if (!password) {
    console.error("Contact email configuration missing", ["GMAIL_APP_PASSWORD"]);
    throw new Error("L’envoi par e-mail n’est pas configuré.");
  }

  const transporter = createTransport({
    service: "gmail",
    auth: { user: CONTACT_EMAIL, pass: password },
  });

  try {
    await transporter.sendMail({
      from: CONTACT_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: submission.email,
      subject: `[DRAC Plateaux] ${submission.subject}`,
      text: [
        `Nom : ${submission.name}`,
        `Adresse e-mail : ${submission.email}`,
        `Objet : ${submission.subject}`,
        "",
        submission.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error(
      "Contact email delivery failed",
      error && typeof error === "object" && "code" in error ? error.code : "Unknown SMTP error",
    );
    throw new Error(
      "Gmail n’a pas pu envoyer votre message. Vérifiez la configuration ou réessayez.",
    );
  }
}
