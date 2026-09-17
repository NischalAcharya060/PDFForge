export type PdfToolStatus =
  | "idle"
  | "ready"
  | "processing"
  | "completed"
  | "error";

export interface FileWithMeta {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  pageCount?: number;
}

export interface PdfToolResult {
  blob: Blob;
  filename: string;
  size: number;
  inputSize: number;
  isZip?: boolean;
  pageCount?: number;
  note?: string;
  savedPercent?: number;
}

export interface RunContext {
  files: FileWithMeta[];
  setMessage: (message: string) => void;
}

export type ProgressCallback = (message: string) => void;