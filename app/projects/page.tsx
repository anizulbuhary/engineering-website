import { PageHero } from "@/components/ui/Primitives";
import { pages } from "@/content/pages";
import { projects } from "@/content/projects";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata("Concept projects", pages.projects.intro);
export default function Page() {
  return (
    <>
      <PageHero {...pages.projects} />
      <ProjectFilter projects={projects} />
      <ContactCTA />
    </>
  );
}
