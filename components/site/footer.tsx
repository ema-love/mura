import Link from "next/link";
import { Logo } from "./logo";
import { navLinks, signInHref } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="page flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">Prepare yourself.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={signInHref} className="transition-colors hover:text-foreground">
                Your purchases
              </Link>
            </li>
            <li>
              <Link href="/about#contact" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
