import { notFound } from "next/navigation";
import { articles } from "@/content/insights";
import { ArticleDetail } from "@/components/insights/ArticleDetail";
import { ContactCTA } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/metadata";
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  return a ? pageMetadata(a.title, a.summary) : { title: "Article not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <ArticleDetail article={a} />
      <ContactCTA />
    </>
  );
}
