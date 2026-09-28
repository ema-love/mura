"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowDownToLine,
  Check,
  Circle,
  LoaderCircle,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = { id: string; name: string };
type HealthCheck = { name: string; ok: boolean; detail: string };
type Status = {
  id: string;
  name: string;
  uploaded: boolean;
  size?: number;
  uploadedAt?: string;
};

const when = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const field =
  "h-12 w-full rounded-full bg-card px-5 text-[15px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)]";

/** Owner-only: pick a template, pick its .xlsx, enter the password. */
export function UploadForm({ products }: { products: Option[] }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const status = useMutation({
    mutationFn: async (pw: string) => {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.error ?? "Couldn't load the upload status.");
      return data.items as Status[];
    },
  });

  const health = useMutation({
    mutationFn: async (testEmail: boolean) => {
      const res = await fetch("/api/admin/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, testEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't run the checks.");
      return data.checks as HealthCheck[];
    },
  });

  const upload = useMutation({
    onSuccess: () => status.mutate(password),
    mutationFn: async () => {
      const body = new FormData();
      body.set("productId", productId);
      body.set("password", password);
      if (file) body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.error ?? "The upload failed. Please try again.");
      return data as { productName: string; size: number };
    },
  });

  return (
    <>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          upload.mutate();
        }}
      >
        <div>
          <label
            htmlFor="up-product"
            className="text-[13px] font-medium text-muted-foreground"
          >
            Template
          </label>
          <select
            id="up-product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={cn(field, "mt-2 appearance-none")}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="up-file"
            className="text-[13px] font-medium text-muted-foreground"
          >
            Excel file (.xlsx)
          </label>
          <input
            id="up-file"
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full rounded-3xl bg-card p-4 text-sm hairline file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-background"
          />
        </div>

        <div>
          <label
            htmlFor="up-password"
            className="text-[13px] font-medium text-muted-foreground"
          >
            Upload password
          </label>
          <input
            id="up-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(field, "mt-2")}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!file || !password || upload.isPending}
          className="w-full"
        >
          {upload.isPending ? (
            <LoaderCircle className="animate-spin" aria-label="Uploading" />
          ) : (
            <>
              Upload <Upload />
            </>
          )}
        </Button>

        <div aria-live="polite">
          {upload.isSuccess && (
            <p className="flex items-start gap-2 rounded-3xl bg-accent-soft p-4 text-sm hairline dark:bg-accent">
              <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {upload.data.productName} is live (
                {(upload.data.size / 1024).toFixed(0)} KB). Customers now
                receive this file. Uploading again replaces it.
              </span>
            </p>
          )}
          {upload.isError && (
            <p role="alert" className="text-sm text-[#b0614f]">
              {upload.error.message}
            </p>
          )}
        </div>

        <section aria-labelledby="status-title" className="border-t pt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 id="status-title" className="font-medium">
              What customers receive
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!password || status.isPending}
              onClick={() => status.mutate(password)}
            >
              {status.isPending ? (
                <LoaderCircle className="animate-spin" aria-label="Checking" />
              ) : (
                <RefreshCw />
              )}{" "}
              Check uploads
            </Button>
          </div>
          {!status.data && !status.isError && (
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your password above, then press Check uploads.
            </p>
          )}
          {status.isError && (
            <p role="alert" className="mt-3 text-sm text-[#b0614f]">
              {status.error.message}
            </p>
          )}
          {status.data && (
            <ul className="mt-5 divide-y rounded-3xl bg-card hairline">
              {status.data.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 text-sm"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {item.uploaded ? (
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-accent-ink"
                        aria-label="Uploaded"
                      />
                    ) : (
                      <Circle
                        className="mt-0.5 size-4 shrink-0 text-subtle-foreground"
                        aria-label="Not uploaded"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.uploaded
                          ? [
                              item.size
                                ? `${Math.max(1, Math.round(item.size / 1024))} KB`
                                : null,
                              when(item.uploadedAt),
                            ]
                              .filter(Boolean)
                              .join(" · ")
                          : "Not uploaded yet — customers can't get this one"}
                      </p>
                    </div>
                  </div>
                  {item.uploaded && (
                    <Button
                      type="submit"
                      form={`check-${item.id}`}
                      variant="ghost"
                      size="sm"
                      aria-label={`Download ${item.name} to check it`}
                    >
                      <ArrowDownToLine />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="health-title" className="border-t pt-8">
          <h2 id="health-title" className="font-medium">
            Check setup
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tests the live email and payment settings and says exactly what to fix. Never shows a password or key.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={!password || health.isPending} onClick={() => health.mutate(false)}>
              {health.isPending ? <LoaderCircle className="animate-spin" aria-label="Checking" /> : <RefreshCw />} Check setup
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={!password || health.isPending} onClick={() => health.mutate(true)}>
              Send test email
            </Button>
          </div>
          {health.isError && (
            <p role="alert" className="mt-3 text-sm text-[#b0614f]">
              {health.error.message}
            </p>
          )}
          {health.data && (
            <ul className="mt-5 divide-y rounded-3xl bg-card hairline">
              {health.data.map((c) => (
                <li key={c.name} className="flex items-start gap-3 px-5 py-4 text-sm">
                  {c.ok ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-label="OK" />
                  ) : (
                    <span aria-label="Needs fixing" className="mt-1 size-2.5 shrink-0 rounded-full bg-[#c0735f]" />
                  )}
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className={cn("mt-0.5 text-xs", c.ok ? "text-muted-foreground" : "text-foreground")}>{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </form>
      {/* Separate forms (forms can't nest): a POST keeps the password out of the URL. */}
      {status.data
        ?.filter((item) => item.uploaded)
        .map((item) => (
          <form
            key={item.id}
            id={`check-${item.id}`}
            method="post"
            action="/api/admin/file"
            hidden
          >
            <input type="hidden" name="password" value={password} />
            <input type="hidden" name="productId" value={item.id} />
          </form>
        ))}
    </>
  );
}
