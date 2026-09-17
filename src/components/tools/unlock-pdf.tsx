"use client";

import { useCallback, useState } from "react";
import { Eye, EyeOff, LockOpen, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer } from "@/lib/files";
import { unlockPdf } from "@/lib/pdf/unlock";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UnlockPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetLocal = useCallback(() => {
    setPassword("");
    setLocalError(null);
  }, []);

  const handleAddFiles = useCallback(
    (next: File[]) => {
      resetLocal();
      addFiles(next);
    },
    [addFiles, resetLocal],
  );

  const handleClearFiles = useCallback(() => {
    resetLocal();
    clearFiles();
  }, [clearFiles, resetLocal]);

  const handleRemoveFile = useCallback(
    (id: string) => {
      resetLocal();
      removeFile(id);
    },
    [removeFile, resetLocal],
  );

  const handleReset = useCallback(() => {
    resetLocal();
    reset();
  }, [reset, resetLocal]);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("No file selected.");
    if (!password) {
      throw new Error("Please enter the password to decrypt this document.");
    }
    const bytes = await fileToArrayBuffer(file.file);
    const bytesOut = await unlockPdf(bytes, password, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    const baseName = file.name.replace(/\.pdf$/i, "");
    return {
      blob,
      filename: `${baseName}-unlocked.pdf`,
      size: blob.size,
      inputSize: file.size,
      note: "Password security and restrictions have been removed. This PDF can now be opened without a password.",
    };
  }, [files, password]);

  const handleSubmit = useCallback(async () => {
    if (!password) {
      setLocalError("Please enter the document password.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [password, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={handleAddFiles}
              hint="Remove password protection and restrictions from your PDF document."
            />
          ) : null}

          {files.length > 0 ? (
            <div className="flex flex-col gap-6">
              <FileList
                files={files}
                onRemove={handleRemoveFile}
                onClear={handleClearFiles}
                showPageCount
              />

              <ConfigurationPanel
                title="Unlock Document"
                description="Enter the known password to decrypt the PDF and remove all opening restrictions."
              >
                <div className="space-y-2">
                  <Label htmlFor="pdf-password">Current Document Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      id="pdf-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLocalError(null);
                      }}
                      placeholder="Enter password to unlock"
                      className="pr-10"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Decryption is performed locally in your browser — your password and document are never sent anywhere.
                  </p>
                </div>
              </ConfigurationPanel>

              {error || localError ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{error ?? localError}</p>
                </div>
              ) : null}

              {status === "processing" ? (
                <ProcessingState message={message} />
              ) : null}
              {status === "completed" && result ? (
                <ResultPanel result={result} onReset={handleReset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="lg" onClick={handleSubmit} disabled={!password}>
                    <LockOpen className="size-4" aria-hidden="true" />
                    Unlock PDF
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
