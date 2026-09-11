import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { ContactSection } from "@/components/sections/Studio";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Start a conversation",
  pages.contact.intro,
);
export default function Page() {
  return (
    <>
      <PageHero {...pages.contact} />
      <ContactSection />
    </>
  );
}
