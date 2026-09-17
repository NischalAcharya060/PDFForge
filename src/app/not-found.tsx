import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-semibold tracking-tight text-primary">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
        This page isn&apos;t in the forge
      </h1>
      <p className="mt-3 max-w-md text-balance text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Try one of our tools instead.
      </p>
      <Button size="lg" asChild className="mt-8">
        <Link href="/tools">
          Browse all tools
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </Container>
  );
}