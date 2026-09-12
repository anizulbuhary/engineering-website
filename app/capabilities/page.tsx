import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { Capabilities } from "@/components/sections/Capabilities";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("Services", pages.capabilities.intro);
export default function Page() {
  return (
    <>
      <PageHero {...pages.capabilities} />
      <Capabilities full />
      <ContactCTA />
    </>
  );
}
