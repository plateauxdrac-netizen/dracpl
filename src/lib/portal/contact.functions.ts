import { createServerFn } from "@tanstack/react-start";
import { CONTACT_EMAIL, contactSchema } from "./contact";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { sendContactEmail } = await import("./contact.email");
    await sendContactEmail(data);

    let stored = false;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("contact_submissions").insert({
        ...data,
        recipient: CONTACT_EMAIL,
      });
      if (error) {
        console.error("Contact storage failed", error.code);
      } else {
        stored = true;
      }
    } catch (error) {
      console.error(
        "Contact storage failed",
        error instanceof Error ? error.message : "Unknown storage error",
      );
    }

    return { stored, emailed: true };
  });
