"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { getToolBySlug } from "@/config/tools";
import type { ToolDefinition } from "@/config/tools";
import { ToolHeader } from "@/components/tool/tool-header";
import { Skeleton } from "@/components/ui/skeleton";

type ToolComponent = ComponentType<{ tool: ToolDefinition }>;

function ToolSkeleton() {
  return (
    <div className="space-y-4 py-8" aria-hidden="true">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

function makeDynamicTool(loader: () => Promise<{ default: ToolComponent }>) {
  return dynamic(loader, { loading: ToolSkeleton });
}

const toolComponents: Record<string, ToolComponent> = {
  "merge-pdf": makeDynamicTool(() => import("@/components/tools/merge-pdf")),
  "split-pdf": makeDynamicTool(() => import("@/components/tools/split-pdf")),
  "compress-pdf": makeDynamicTool(() => import("@/components/tools/compress-pdf")),
  "rotate-pdf": makeDynamicTool(() => import("@/components/tools/rotate-pdf")),
  "jpg-to-pdf": makeDynamicTool(() => import("@/components/tools/jpg-to-pdf")),
  "pdf-to-jpg": makeDynamicTool(() => import("@/components/tools/pdf-to-jpg")),
  "delete-pdf-pages": makeDynamicTool(() => import("@/components/tools/delete-pdf-pages")),
  "extract-pdf-pages": makeDynamicTool(() => import("@/components/tools/extract-pdf-pages")),
  "reorder-pdf-pages": makeDynamicTool(() => import("@/components/tools/reorder-pdf-pages")),
  "protect-pdf": makeDynamicTool(() => import("@/components/tools/protect-pdf")),
  "page-numbers-pdf": makeDynamicTool(() => import("@/components/tools/page-numbers-pdf")),
  "watermark-pdf": makeDynamicTool(() => import("@/components/tools/watermark-pdf")),
};

export function ToolView({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const Component = toolComponents[slug];
  if (!Component) return null;

  return (
    <>
      <ToolHeader tool={tool} />
      <Component tool={tool} />
    </>
  );
}