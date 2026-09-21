export type RangeParseError = Error;

/** Convert user input like "1-3, 5, 8-10" into 0-based page indices. */
export function parsePageRanges(
  input: string,
  pageCount: number,
  maxPages?: number,
): number[] {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Enter at least one page or range to continue — for example: 1-3, 5, 8-10.");
  }

  const maxSelectable = maxPages ?? Infinity;
  const parts = raw.split(",");
  const pages: number[] = [];
  const seen = new Set<number>();

  for (const partRaw of parts) {
    const part = partRaw.trim();
    if (!part) continue;

    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!match) {
      throw new Error(`We couldn't understand "${part}". Use page numbers or ranges like 1-3, 5, or 8-10.`);
    }

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;

    if (start < 1 || end < 1 || start > pageCount || end > pageCount) {
      throw new Error(
        `The page range "${part}" is outside this document. Pages must be between 1 and ${pageCount}.`,
      );
    }
    if (start > end) {
      throw new Error(`The range "${part}" starts after it ends. Swap the numbers and try again.`);
    }

    for (let page = start; page <= end; page++) {
      if (!seen.has(page)) {
        seen.add(page);
        pages.push(page);
      }
    }
  }

  if (pages.length === 0) {
    throw new Error("Enter at least one page or range to continue — for example: 1-3, 5, 8-10.");
  }
  if (pages.length > maxSelectable) {
    throw new Error(
      `You can select up to ${maxSelectable} pages at a time. Please narrow your range and try again.`,
    );
  }

  return pages.map((page) => page - 1);
}

/** Format 0-based indices back to a human-friendly 1-based page list. */
export function formatPageList(indices: number[]): string {
  if (indices.length === 0) return "";
  const sorted = [...indices].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    ranges.push(start === prev ? `${start + 1}` : `${start + 1}-${prev + 1}`);
    start = current;
    prev = current;
  }
  return ranges.join(", ");
}