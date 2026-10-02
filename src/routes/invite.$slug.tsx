import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/wedding-invitation";
import { weddingData } from "@/lib/wedding-data";

export const Route = createFileRoute("/invite/$slug")({
  head: ({ params }) => ({ meta: [
    { title: `${weddingData.couple.groom} & ${weddingData.couple.bride} — Wedding Invitation` },
    { name: "description", content: `You are invited to celebrate the wedding of ${weddingData.couple.groom} and ${weddingData.couple.bride}.` },
    { property: "og:title", content: `${weddingData.couple.groom} & ${weddingData.couple.bride}` },
    { property: "og:description", content: `Open the invitation for ${params.slug.replaceAll("-", " ")}.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: InvitePage,
});

function InvitePage() {
  return <WeddingInvitation data={weddingData} />;
}