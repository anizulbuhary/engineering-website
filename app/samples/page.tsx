import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { samples } from "@/content/samples";
import { SampleGallery } from "@/components/samples/SampleGallery";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Documentation samples",
  pages.samples.intro,
);
export default function Page() {
  return (
    <>
      <PageHero {...pages.samples} />
      <SampleGallery samples={samples} />
      <ContactCTA />
    </>
  );
}
