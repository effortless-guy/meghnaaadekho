import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/wedding-invitation";
import { sampleWedding } from "@/lib/wedding-data";

export const Route = createFileRoute("/invite/$slug")({
  head: ({ params }) => ({ meta: [
    { title: `${sampleWedding.couple.groom} & ${sampleWedding.couple.bride} — Wedding Invitation` },
    { name: "description", content: `You are invited to celebrate the wedding of ${sampleWedding.couple.groom} and ${sampleWedding.couple.bride}.` },
    { property: "og:title", content: `${sampleWedding.couple.groom} & ${sampleWedding.couple.bride}` },
    { property: "og:description", content: `Open the invitation for ${params.slug.replaceAll("-", " ")}.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: InvitePage,
});

function InvitePage() {
  return <WeddingInvitation data={sampleWedding} />;
}