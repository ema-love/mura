import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { Ambient } from "@/components/sections/ambient";
import { ContactForm } from "@/components/site/contact-form";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: "MÚRÀ (moo-rah) means prepare yourself. We make planners, trackers and templates that help students organise student life.",
  alternates: { canonical: "/about" },
};

const beliefs = [
  { title: "Clarity over complexity", body: "Every page earns its place. If it doesn't help you know what to do next, it isn't in the system." },
  { title: "Yours to keep", body: "Pay once and the files are yours. No subscriptions, no accounts, no lock-in." },
  { title: "Made to work together", body: "Every MÚRÀ system shares one design language, so adding another feels natural." },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <section aria-labelledby="about-title" className="relative overflow-hidden pt-36 pb-section md:pt-44">
          <Ambient />
          <div className="page relative">
            <Reveal>
              <p className="eyebrow">About MÚRÀ</p>
              <h1 id="about-title" className="display mt-6 max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)]">
                Prepare yourself.
              </h1>
            </Reveal>
            <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
              <Reveal className="md:col-span-6 md:col-start-6">
                <p className="text-xl leading-relaxed text-pretty text-muted-foreground md:text-2xl md:leading-relaxed">
                  MÚRÀ — pronounced <span className="text-foreground">moo-rah</span> — means <span className="text-foreground">prepare yourself</span>. We
                  make digital systems for students: planners, trackers and templates for semesters, assignments, exams, grades, money
                  and the opportunities that come after.
                </p>
                <p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground">
                  Student life asks you to hold a lot in your head. Our work is to put it somewhere you can see it — calmly, clearly,
                  and in a format you already use — so you always know what you need and what to do next.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-label="What we believe" className="pb-section">
          <div className="page grid gap-6 md:grid-cols-3">
            {beliefs.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06} className="rounded-[28px] bg-card p-8 hairline">
                <h2 className="text-xl font-semibold tracking-[-0.02em]">{b.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{b.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 border-t py-section">
          <div className="page grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title" className="headline mt-5 text-4xl md:text-5xl">
                Say hello.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Questions about a system, a download or an order? Send us a message and we&rsquo;ll reply by email — or write to{" "}
                <a href={`mailto:${brand.contactEmail}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                  {brand.contactEmail}
                </a>
                .
              </p>
              <Link href="/access" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
                Looking for your downloads? <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
            <Reveal delay={0.05} className="relative md:col-span-7 md:col-start-6">
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
