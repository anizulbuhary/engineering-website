import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { Principles } from "@/components/sections/Studio";
import { ProcessSection } from "@/components/sections/Home";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("Our approach", pages.why.intro);
export default function Page() {
  return (
    <>
      <PageHero {...pages.why} />
      <Principles />
      <ProcessSection />
      <ContactCTA />
    </>
  );
}
