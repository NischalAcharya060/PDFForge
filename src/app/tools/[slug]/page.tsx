import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getToolBySlug } from "@/config/tools";
import { getToolSeoContent } from "@/config/seo-content";
import { siteConfig } from "@/config/site";
import {
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  webApplicationSchema,
} from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { ToolSeoContent } from "@/components/seo/tool-seo-content";
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

  const toolUrl = `${siteConfig.url}/tools/${tool.slug}`;

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    keywords: [
      tool.name,
      tool.name.toLowerCase(),
      tool.seoDescription,
      `${siteConfig.name} ${tool.name}`,
      "free PDF tool",
      "online PDF tool",
    ],
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: toolUrl,
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const content = getToolSeoContent(slug);

  const schemas = [
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "PDF Tools", path: "/tools" },
      { name: tool.name, path: `/tools/${tool.slug}` },
    ]),
    webApplicationSchema(tool, { featureList: content?.features }),
  ];

  if (content) {
    schemas.push(faqPageSchema(content.faqs));
    schemas.push(howToSchema(`How to use ${tool.name}`, content.howTo));
  }

  return (
    <main>
      <ToolView slug={tool.slug} />
      <ToolSeoContent tool={tool} />
      {schemas.map((schema) => (
        <JsonLd key={schema["@type"] as string} data={schema} />
      ))}
    </main>
  );
}