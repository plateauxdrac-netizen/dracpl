import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "@/lib/portal/contact.email";

const mocks = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({ createTransport: mocks.createTransport }));

const submission = {
  name: "Visiteur test",
  email: "test@example.com",
  subject: "Projet culturel" as const,
  message: "Une demande concernant un projet culturel.",
  consent: true as const,
};

beforeEach(() => {
  vi.stubEnv("GMAIL_APP_PASSWORD", "abcd efgh ijkl mnop");
  mocks.createTransport.mockReturnValue({ sendMail: mocks.sendMail });
  mocks.sendMail.mockReset();
  mocks.sendMail.mockResolvedValue({ accepted: ["plateauxdrac@gmail.com"] });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("contact email delivery", () => {
  it("sends the enquiry from the contact Gmail account with the visitor set as reply-to", async () => {
    await sendContactEmail(submission);

    expect(mocks.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: { user: "plateauxdrac@gmail.com", pass: "abcdefghijklmnop" },
    });
    expect(mocks.sendMail).toHaveBeenCalledWith({
      from: "plateauxdrac@gmail.com",
      to: "plateauxdrac@gmail.com",
      replyTo: "test@example.com",
      subject: "[DRAC Plateaux] Projet culturel",
      text: [
        "Nom : Visiteur test",
        "Adresse e-mail : test@example.com",
        "Objet : Projet culturel",
        "",
        "Une demande concernant un projet culturel.",
      ].join("\n"),
    });
  });

  it("reports missing email configuration", async () => {
    vi.stubEnv("GMAIL_APP_PASSWORD", "");

    await expect(sendContactEmail(submission)).rejects.toThrow("n’est pas configuré");
    expect(mocks.createTransport).not.toHaveBeenCalled();
  });

  it("does not report success when Gmail rejects the message", async () => {
    mocks.sendMail.mockRejectedValue(new Error("Authentication failed"));

    await expect(sendContactEmail(submission)).rejects.toThrow("Gmail n’a pas pu envoyer");
  });
});
