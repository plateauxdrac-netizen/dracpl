CREATE TABLE public.contact_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL,
 email text NOT NULL,
 subject text NOT NULL,
 message text NOT NULL,
 recipient text NOT NULL DEFAULT 'dracplateaux2004@gmail.com',
 consent boolean NOT NULL
);
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;