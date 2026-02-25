import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { members as teamMembers } from "@/lib/configs/members";

export default async function AboutPage() {
  const t = await getTranslations("About");
  const tCommon = await getTranslations("Common");

  const values = [
    {
      order: "01",
      title: t("values.1.title"),
      description: t("values.1.description"),
    },
    {
      order: "02",
      title: t("values.2.title"),
      description: t("values.2.description"),
    },
    {
      order: "03",
      title: t("values.3.title"),
      description: t("values.3.description"),
    },
    {
      order: "04",
      title: t("values.4.title"),
      description: t("values.4.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t("title")}
        overline={t("established")}
        className="pt-24 md:pt-32"
      />

      <section className="marketing-section pt-0">
        <div className="marketing-container">
          <div className="max-w-4xl">
            <p className="font-display text-2xl md:text-4xl font-medium leading-tight tracking-tighter uppercase text-balance">
              <span className="text-primary">{t("intro1")}</span> {t("intro2")}
            </p>
            <p className="text-xl md:text-2xl font-light leading-relaxed mt-12 text-muted-foreground/60 text-pretty">
              {t("intro3")}
            </p>
          </div>
        </div>
      </section>

      <section className="marketing-section bg-muted/30">
        <div className="marketing-container">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tighter leading-none">
              {t("guidesTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xs text-lg font-light">
              {t("guidesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="relative group flex flex-col gap-4"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={member.image || "/images/guide.jpg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-1 px-2">
                  <h3 className="font-display text-3xl font-medium uppercase text-foreground">
                    {member.name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            {values.map((val) => (
              <div
                key={val.title}
                className="flex flex-col border-t border-foreground/10 pt-8 group hover:border-primary transition-colors duration-500"
              >
                <span className="font-mono text-xs text-primary font-bold mb-6">
                  ({val.order})
                </span>
                <h3 className="font-display text-2xl font-medium mb-4 uppercase group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {val.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-light">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section pb-24 md:pb-32">
        <div className="marketing-container">
          <div className="py-24 md:py-32 text-center bg-foreground text-background rounded-[2.5rem] relative overflow-hidden">
            <div className="relative z-10 px-6">
              <h2 className="font-display text-4xl md:text-6xl font-medium uppercase tracking-tighter leading-[0.9] mb-12 max-w-2xl mx-auto">
                {t("startJourney")}
              </h2>
              <Button
                size="lg"
                variant="secondary"
                className="h-16 px-12 rounded-full font-display uppercase tracking-widest text-xs hover:scale-105 transition-all duration-500"
                render={<Link href="/contact" />}
              >
                {tCommon("getInTouch")}
              </Button>
            </div>

            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
