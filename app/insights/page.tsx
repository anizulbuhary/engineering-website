import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { articles } from "@/content/insights";
import { ArticleList } from "@/components/insights/ArticleList";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("Insights", pages.insights.intro);
export default function Page() {
  return (
    <>
      <PageHero {...pages.insights} />
      <ArticleList articles={articles} />
      <ContactCTA />
    </>
  );
}
