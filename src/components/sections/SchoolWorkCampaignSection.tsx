import Link from "next/link";
import { ArrowRight, CalendarCheck2, CheckCircle2, MessageCircle } from "lucide-react";
import { getActiveHomeCampaign } from "@/data/campaigns";
import { Button } from "@/components/ui/button";

export function SchoolWorkCampaignSection() {
  const campaign = getActiveHomeCampaign();

  if (!campaign) return null;

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-black/15 py-14 sm:py-20" aria-labelledby="campaign-title">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-cyan-500/8 blur-[110px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="surface-panel grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
          <div>
            <div className="section-kicker mb-4">
              <CalendarCheck2 className="h-4 w-4" />
              {campaign.eyebrow}
            </div>
            <h2 id="campaign-title" className="max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {campaign.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {campaign.description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="min-h-14 rounded-2xl px-7 font-bold">
                <Link href={campaign.href}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {campaign.primaryCta}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-14 rounded-2xl px-7 font-semibold">
                <Link href={campaign.secondaryHref}>
                  {campaign.secondaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid content-start gap-3 sm:grid-cols-2">
            {campaign.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-100 transition-all hover:border-primary/35 hover:bg-primary/8">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {link.label}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
