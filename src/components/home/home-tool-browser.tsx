"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { tools, type ToolCategory } from "@/config/tools";
import { ToolCard } from "@/components/home/tool-card";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

type FilterTab = "all" | ToolCategory;

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All Tools" },
  { id: "organize", label: "Organize" },
  { id: "compress", label: "Optimize" },
  { id: "convert", label: "Convert" },
  { id: "edit", label: "Edit" },
  { id: "security", label: "Security" },
];

export function HomeToolBrowser() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterTab>("all");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortName.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  return (
    <section id="tools" className="scroll-mt-16 py-12 sm:py-16">
      <Container>
        {/* Search & Filter Header Bar */}
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Most Popular PDF Tools
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Select a tool below or search to merge, split, compress, watermark, or protect your files.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative mx-auto max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
              <Search className="size-5 text-primary" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any tool: merge, split, compress, watermark, protect..."
              className="w-full rounded-2xl border-2 border-border/80 bg-card py-3.5 pl-12 pr-10 text-sm font-medium shadow-xs transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? tools.length
                  : tools.filter((t) => t.category === tab.id).length;

              const isSelected = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-xs",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                      : "border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="mt-10">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed p-12 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
                <Search className="size-6" />
              </span>
              <h3 className="font-bold text-base">No matching tools found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for &quot;merge&quot;, &quot;compress&quot;, &quot;split&quot;, or &quot;protect&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-xs font-semibold text-primary hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
