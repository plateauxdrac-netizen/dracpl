import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL, contactSchema } from "@/lib/portal/contact";

describe("contact recipient", () => {
  it("routes enquiries to the address supplied by the owner", () => {
    expect(CONTACT_EMAIL).toBe("plateauxdrac@gmail.com");
  });
});

describe("contact validation", () => {
  const submission = {
    name: "Visiteur test",
    email: "test@example.com",
    subject: "Projet culturel",
    message: "Une demande concernant un projet culturel.",
    consent: true,
  };
  it("accepts a complete enquiry", () => {
    expect(contactSchema.safeParse(submission).success).toBe(true);
  });
  it("requires consent", () => {
    expect(contactSchema.safeParse({ ...submission, consent: false }).success).toBe(false);
  });
  it("rejects an invalid reply address", () => {
    expect(contactSchema.safeParse({ ...submission, email: "invalid" }).success).toBe(false);
  });
});
