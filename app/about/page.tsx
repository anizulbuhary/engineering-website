import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { StudioImage, Principles } from "@/components/sections/Studio";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("The studio", pages.about.intro);
export default function About() {
  return (
    <>
      <PageHero {...pages.about} />
      <StudioImage />
      <Principles about />
      <ContactCTA />
    </>
  );
}
