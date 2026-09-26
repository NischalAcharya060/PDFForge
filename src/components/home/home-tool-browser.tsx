"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Combine,
  Lock,
  PenTool,
  RefreshCw,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { tools, type ToolCategory } from "@/config/tools";
import { ToolCard } from "@/components/home/tool-card";
import { Container } from "@/components/layout/container";
import { RevealGroup } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type FilterTab = "all" | ToolCategory;

const filterTabs: {
  id: FilterTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "all", label: "All Tools", icon: Sparkles },
  { id: "organize", label: "Organize", icon: Combine },
  { id: "compress", label: "Optimize", icon: Zap },
  { id: "convert", label: "Convert", icon: ArrowLeftRight },
  { id: "edit", label: "Edit", icon: PenTool },
  { id: "security", label: "Security", icon: Lock },
];

export function HomeToolBrowser() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterTab>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey '/' to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const isFiltered = query !== "" || selectedCategory !== "all";

  return (
    <section id="tools" className="relative scroll-mt-20 py-16 sm:py-24">
      {/* Ambient wash so the grid sits on a softly lit stage. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bloom-primary-soft opacity-50"
      />

      <Container className="relative">
        {/* Search & Filter Header Bar */}
        <div className="mx-auto max-w-4xl space-y-7">
          <div className="animate-fade-up space-y-3 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>COMPLETE CLIENT-SIDE SUITE</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Explore All {tools.length} PDF Tools
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every tool executes immediately in your browser memory. No queue, no
              files sent over the wire.
            </p>
          </div>

          {/* Search Input Box with Ambient Backlight */}
          <div className="group relative mx-auto max-w-2xl animate-fade-up" style={{ animationDelay: "90ms" }}>
            <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/25 via-amber-500/12 to-primary/25 opacity-40 blur-lg transition-opacity duration-500 group-hover:opacity-80" />

            <div className="glass relative flex items-center rounded-2xl border-2 border-border/80 bg-card/90 shadow-md transition-all duration-300 focus-within:border-primary focus-within:shadow-premium-lg">
              <div className="pointer-events-none flex items-center pl-4 text-muted-foreground">
                <Search className="size-5 text-primary transition-transform duration-300 group-focus-within:scale-110" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any tool: merge, split, compress, watermark, protect..."
                aria-label="Search PDF tools"
                className="w-full bg-transparent py-4 pl-3.5 pr-20 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="press flex size-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                ) : (
                  <kbd className="pointer-events-none hidden h-6 items-center gap-0.5 rounded-md border border-border bg-muted/60 px-2 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs sm:inline-flex">
                    /
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div
            className="flex animate-fade-up flex-wrap items-center justify-center gap-2 pt-1"
            style={{ animationDelay: "160ms" }}
          >
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? tools.length
                  : tools.filter((t) => t.category === tab.id).length;

              const isSelected = selectedCategory === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "press group/tab relative flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-xs",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-premium"
                      : "border border-border/80 bg-card/80 text-muted-foreground backdrop-blur-sm hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  <TabIcon
                    className={cn(
                      "size-3.5 transition-transform duration-300 group-hover/tab:rotate-6",
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground/80 group-hover/tab:text-primary",
                    )}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 font-mono text-[10px]",
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

          {/* Results count indication */}
          {isFiltered && (
            <div className="flex items-center justify-between px-1 pt-1 text-xs text-muted-foreground">
              <span>
                Showing{" "}
                <strong className="text-foreground">{filteredTools.length}</strong>{" "}
                of {tools.length} tools
                {selectedCategory !== "all" ? ` in ${selectedCategory}` : ""}
                {query ? ` matching "${query}"` : ""}
              </span>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                }}
                className="flex cursor-pointer items-center gap-1 font-semibold text-primary transition-opacity hover:opacity-75"
              >
                <RefreshCw className="size-3" />
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Tools Grid */}
        <div className="mt-10">
          {filteredTools.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={55}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </RevealGroup>
          ) : (
            <div className="animate-scale-in rounded-3xl border-2 border-dashed border-border/80 bg-card/50 p-12 text-center backdrop-blur-sm">
              <span className="mb-3 inline-flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-inner">
                <Search className="size-6 text-primary" />
              </span>
              <h3 className="text-lg font-bold text-foreground">
                No matching PDF tools found
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
                We couldn&apos;t find anything matching &quot;{query}&quot;. Try
                searching for &quot;merge&quot;, &quot;compress&quot;, &quot;split&quot;, or
                &quot;protect&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                }}
                className="press mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-premium"
              >
                <RefreshCw className="size-3.5" />
                Show All {tools.length} Tools
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
