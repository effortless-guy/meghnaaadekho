CREATE TABLE public.wedding_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' AND char_length(slug) BETWEEN 3 AND 80),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  template_id text NOT NULL DEFAULT 'sacred-garden' CHECK (template_id IN ('sacred-garden', 'royal-celebration')),
  wedding_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_invitations TO authenticated;
GRANT SELECT ON public.wedding_invitations TO anon;
GRANT ALL ON public.wedding_invitations TO service_role;
ALTER TABLE public.wedding_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published invitations are public" ON public.wedding_invitations FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Creators read own invitations" ON public.wedding_invitations FOR SELECT TO authenticated USING (owner_id = auth.uid() OR status = 'published');
CREATE POLICY "Creators create own invitations" ON public.wedding_invitations FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Creators update own invitations" ON public.wedding_invitations FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Creators delete own invitations" ON public.wedding_invitations FOR DELETE TO authenticated USING (owner_id = auth.uid());
CREATE INDEX wedding_invitations_owner_idx ON public.wedding_invitations(owner_id);

CREATE TABLE public.rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.wedding_invitations(id) ON DELETE CASCADE,
  guest_name text NOT NULL CHECK (char_length(guest_name) BETWEEN 1 AND 100),
  attending boolean NOT NULL,
  party_size integer NOT NULL DEFAULT 1 CHECK (party_size BETWEEN 1 AND 20),
  dietary_requirements text NOT NULL DEFAULT '' CHECK (char_length(dietary_requirements) <= 500),
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
  website text NOT NULL DEFAULT '' CHECK (char_length(website) <= 200),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rsvp_responses TO authenticated;
GRANT INSERT ON public.rsvp_responses TO anon, authenticated;
GRANT ALL ON public.rsvp_responses TO service_role;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests submit RSVPs to published invitations" ON public.rsvp_responses FOR INSERT TO anon, authenticated WITH CHECK (website = '' AND EXISTS (SELECT 1 FROM public.wedding_invitations i WHERE i.id = invitation_id AND i.status = 'published'));
CREATE POLICY "Creators read invitation RSVPs" ON public.rsvp_responses FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.wedding_invitations i WHERE i.id = invitation_id AND i.owner_id = auth.uid()));
CREATE INDEX rsvp_responses_invitation_idx ON public.rsvp_responses(invitation_id);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER wedding_invitations_set_updated_at BEFORE UPDATE ON public.wedding_invitations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();