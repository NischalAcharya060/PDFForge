"use client";

import { useCallback, useState } from "react";
import { Lock, TriangleAlert } from "lucide-react";

import type { ToolDefinition } from "@/config/tools";
import type { PdfToolResult } from "@/lib/types";
import { usePdfTool } from "@/lib/use-pdf-tool";
import { fileToArrayBuffer, outputFileName } from "@/lib/files";
import { encryptPdf } from "@/lib/pdf/encrypt";
import { bytesToBlob } from "@/lib/download";
import { Container } from "@/components/layout/container";
import { UploadZone } from "@/components/upload/upload-zone";
import { FileList } from "@/components/files/file-list";
import { ProcessingState } from "@/components/tool/processing-state";
import { ResultPanel } from "@/components/tool/result-panel";
import { ConfigurationPanel } from "@/components/tool/configuration-panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MIN_PASSWORD = 4;

export default function ProtectPdfTool({ tool }: { tool: ToolDefinition }) {
  const toolState = usePdfTool({
    accept: tool.supportedExtensions,
    multiple: false,
  });

  const { files, status, message, result, error, addFiles, removeFile, clearFiles, run, reset } = toolState;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [allowPrint, setAllowPrint] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const process = useCallback(async (): Promise<PdfToolResult> => {
    const file = files[0];
    if (!file) throw new Error("Please add a file to get started — drag one into the upload area above.");
    const bytes = await fileToArrayBuffer(file.file);
    const bytesOut = await encryptPdf(bytes, { userPassword: password, allowPrint }, file.name);
    const blob = bytesToBlob(bytesOut, "application/pdf");
    return {
      blob,
      filename: outputFileName(file.name, tool.slug, "pdf"),
      size: blob.size,
      inputSize: file.size,
      note: `This PDF now requires the password you set to open. There is no recovery — keep it safe.`,
    };
  }, [files, password, allowPrint, tool.slug]);

  const handleSubmit = useCallback(async () => {
    if (password.length < MIN_PASSWORD) {
      setLocalError(`Your password needs to be at least ${MIN_PASSWORD} characters long.`);
      return;
    }
    if (password !== confirm) {
      setLocalError("The two passwords don't match. Please re-enter them.");
      return;
    }
    setLocalError(null);
    await run(process);
  }, [password, confirm, run, process]);

  return (
    <section>
      <Container className="py-10">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {files.length === 0 ? (
            <UploadZone
              accept={tool.supportedExtensions}
              multiple={false}
              onFiles={addFiles}
              hint="Lock your PDF with a password. Encryption runs locally in your browser."
            />
          ) : null}

          {files.length > 0 ? (
            <div className="flex flex-col gap-6">
              <FileList
                files={files}
                onRemove={removeFile}
                onClear={clearFiles}
                showPageCount
              />

              <ConfigurationPanel
                title="Password protection"
                description="Set an owner password to restrict who can open the file."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="password" className="mb-2 block">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 4 characters"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="mb-2 block">
                      Confirm password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      placeholder="Repeat the password"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Checkbox
                    id="protect-allow-print"
                    checked={allowPrint}
                    onChange={(event) => setAllowPrint(event.target.checked)}
                  />
                  <Label htmlFor="protect-allow-print" className="cursor-pointer">
                    Allow printing
                  </Label>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Readers still need the password to open the document at all.
                </p>
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
                <ResultPanel result={result} onReset={reset} />
              ) : null}

              {status !== "processing" && status !== "completed" ? (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={files.length === 0}
                >
                  <Lock className="size-4" aria-hidden="true" />
                  Protect PDF
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}