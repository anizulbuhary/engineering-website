import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return p
    ? pageMetadata(p.title, p.description)
    : { title: "Project not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <ProjectDetail project={p} />
      <ContactCTA />
    </>
  );
}
