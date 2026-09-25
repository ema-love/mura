"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "./search";
import { navLinks, shopHref, signInHref } from "@/lib/nav";
import { cn, ease } from "@/lib/utils";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-full pr-2 pl-5 transition-all duration-500 ease-calm",
            scrolled ? "glass [--glass:color-mix(in_oklab,var(--background)_82%,transparent)]" : "bg-transparent",
          )}
        >
          <Link href="/" aria-label="MÚRÀ home" className="rounded-full">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-full pr-2 pl-3 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
              aria-label="Search (Command K)"
            >
              <Search className="size-4" />
              <span>Search</span>
              <kbd className="rounded-md bg-card px-1.5 py-0.5 font-mono text-[10px] hairline">⌘K</kbd>
            </button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search />
            </Button>
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href={signInHref}>Sign In</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href={shopHref}>Shop MÚRÀ</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <motion.ul
              className="flex h-full flex-col justify-center gap-2 px-8"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {navLinks.map((l) => (
                <motion.li key={l.href} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)} className="headline block py-2 text-4xl">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mt-8 flex gap-3">
                <Button asChild size="lg">
                  <Link href={shopHref} onClick={() => setMenuOpen(false)}>
                    Shop MÚRÀ
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href={signInHref} onClick={() => setMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
