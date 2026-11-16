import { createServerFn } from "@tanstack/react-start";
import { CONTACT_EMAIL, contactSchema } from "./contact";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // This public action only inserts validated enquiries; no private data is read.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      ...data,
      recipient: CONTACT_EMAIL,
    });
    if (error) {
      console.error("Contact storage failed", error.code);
      throw new Error("Votre demande n’a pas pu être enregistrée. Veuillez réessayer.");
    }
    return { stored: true, emailed: false };
  });