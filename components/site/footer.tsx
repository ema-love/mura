import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-2 px-5 py-10 sm:flex-row sm:items-center">
        <Logo />
        <p className="text-sm text-muted-foreground">Prepare yourself.</p>
      </div>
    </footer>
  );
}
