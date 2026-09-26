"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, LoaderCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Option = { id: string; name: string };

const field =
  "h-12 w-full rounded-full bg-card px-5 text-[15px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)]";

/** Owner-only: pick a template, pick its .xlsx, enter the password. */
export function UploadForm({ products }: { products: Option[] }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const upload = useMutation({
    mutationFn: async () => {
      const body = new FormData();
      body.set("productId", productId);
      body.set("password", password);
      if (file) body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "The upload failed. Please try again.");
      return data as { productName: string; size: number };
    },
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        upload.mutate();
      }}
    >
      <div>
        <label htmlFor="up-product" className="text-[13px] font-medium text-muted-foreground">
          Template
        </label>
        <select id="up-product" value={productId} onChange={(e) => setProductId(e.target.value)} className={cn(field, "mt-2 appearance-none")}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="up-file" className="text-[13px] font-medium text-muted-foreground">
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
        <label htmlFor="up-password" className="text-[13px] font-medium text-muted-foreground">
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

      <Button type="submit" size="lg" disabled={!file || !password || upload.isPending} className="w-full">
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
              {upload.data.productName} is live ({(upload.data.size / 1024).toFixed(0)} KB). Customers now receive this file. Uploading again
              replaces it.
            </span>
          </p>
        )}
        {upload.isError && (
          <p role="alert" className="text-sm text-[#b0614f]">
            {upload.error.message}
          </p>
        )}
      </div>
    </form>
  );
}
