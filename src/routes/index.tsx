import { createFileRoute } from "@tanstack/react-router";
import { InvitationStudio } from "@/components/invitation-studio";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Vow & Vine — Digital Wedding Invitation Atelier" },
    { name: "description", content: "Create a handcrafted digital wedding invitation with elegant templates and live preview." },
    { property: "og:title", content: "Vow & Vine — Digital Wedding Invitation Atelier" },
    { property: "og:description", content: "Create a handcrafted digital wedding invitation with elegant templates and live preview." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <InvitationStudio />;
}
