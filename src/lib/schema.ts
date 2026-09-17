import type { ToolDefinition } from "@/config/tools";
import { siteConfig } from "@/config/site";

type JsonLd = Record<string, unknown>;

const SCHEMA_CONTEXT = "https://schema.org";

export function organizationSchema(): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    email: siteConfig.supportEmail,
    description: siteConfig.description,
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
    },
  };
}

export function webApplicationSchema(
  tool: Pick<ToolDefinition, "name" | "slug" | "seoDescription"> & {
    category?: ToolDefinition["category"];
  },
  extra?: {
    featureList?: string[];
    url?: string;
  },
): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebApplication",
    name: tool.name,
    url: extra?.url ?? `${siteConfig.url}/tools/${tool.slug}`,
    description: tool.seoDescription,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: tool.category,
    operatingSystem: "Web Browser",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: extra?.featureList,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function faqPageSchema(
  faqs: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbListSchema(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}

export function itemListSchema(
  tools: { name: string; slug: string }[],
): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemList",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${siteConfig.url}/tools/${tool.slug}`,
    })),
  };
}

export function howToSchema(
  name: string,
  steps: { title: string; description: string }[],
): JsonLd {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "HowTo",
    name,
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}