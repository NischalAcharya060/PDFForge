import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/config/tools";
import { siteConfig } from "@/config/site";
import { ToolView } from "@/components/tool/tool-view";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: `${siteConfig.url}/tools/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <main>
      <ToolView slug={tool.slug} />
    </main>
  );
}