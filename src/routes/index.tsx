import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/wedding-invitation";
import { weddingData } from "@/lib/wedding-data";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: `${weddingData.couple.groom} & ${weddingData.couple.bride} — Wedding Invitation` },
    { name: "description", content: `You are invited to celebrate the wedding of ${weddingData.couple.groom} and ${weddingData.couple.bride}.` },
    { property: "og:title", content: `${weddingData.couple.groom} & ${weddingData.couple.bride}` },
    { property: "og:description", content: "Open our Sacred Garden wedding invitation." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function Index() {
  return <WeddingInvitation data={weddingData} />;
}
