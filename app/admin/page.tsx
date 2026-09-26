import type { Metadata } from "next";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { UploadForm } from "@/components/admin/upload-form";
import { visibleProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Upload templates", robots: { index: false, follow: false } };

/** Owner-only upload page. Uploads need the MURA_ADMIN_PASSWORD; the page itself reveals nothing private. */
export default function AdminPage() {
  const options = visibleProducts()
    .filter((p) => p.type !== "bundle")
    .map((p) => ({ id: p.id, name: p.name }));

  return (
    <>
      <Nav />
      <main id="main" className="page grid min-h-[80dvh] place-items-center pt-32 pb-24">
        <div className="w-full max-w-lg">
          <p className="eyebrow">Owner</p>
          <h1 className="headline mt-5 text-4xl md:text-5xl">Upload a template.</h1>
          <p className="mt-4 text-muted-foreground">
            Choose the template and its Excel file. It goes straight to private storage, and customers receive the newest version.
          </p>
          <div className="mt-10">
            <UploadForm products={options} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
