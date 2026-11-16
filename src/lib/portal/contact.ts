import { z } from "zod";

export const CONTACT_EMAIL = "dracplateaux2004@gmail.com";
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.email().max(254),
  subject: z.enum(["Projet culturel", "Patrimoine et documentation", "Information institutionnelle", "Autre demande"]),
  message: z.string().trim().min(10).max(10000),
  consent: z.literal(true),
});