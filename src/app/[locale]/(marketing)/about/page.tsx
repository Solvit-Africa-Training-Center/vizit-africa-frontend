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
    <div className="min-h-screen bg-background pt-32 pb-24">
      <PageHeader
        title={t("title")}
        overline={t("established")}
        className="mb-24 md:mb-32"
      />

      <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32 md:mb-48">
        <div className="max-w-4xl">
          <p className="font-display text-2xl md:text-4xl font-medium leading-tight tracking-tighter uppercase">
            <span className="text-primary">{t("intro1")}</span> {t("intro2")}
          </p>
          <p className="text-xl md:text-2xl font-light leading-relaxed mt-12 text-muted-foreground/60">
            {t("intro3")}
          </p>
        </div>
      </section>

      <section className="mb-32 md:mb-48 py-12 px-5 md:px-10 max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tighter leading-none">
            {t("guidesTitle")}
          </h2>
          <p className="text-muted-foreground max-w-xs text-lg font-light">
            {t("guidesDescription")}
          </p>
        </div>

        <div className="">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="relative group flex flex-col gap-2"
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={member.image || "/images/guide.jpg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-4xl font-medium uppercase text-foreground">
                    {member.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-7xl mx-auto mb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {values.map((val) => (
            <div
              key={val.title}
              className="flex flex-col border-t border-foreground pt-6 group hover:border-primary transition-colors duration-500"
            >
              <span className="font-mono text-sm text-muted-foreground mb-4">
                ({val.order})
              </span>
              <h3 className="font-display text-3xl font-medium mb-4 uppercase group-hover:text-primary transition-colors duration-300">
                {val.title}
              </h3>
              <p className="text-muted-foreground/80 leading-relaxed text-sm">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-7xl mx-auto py-24 md:py-32 text-center bg-foreground text-background rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-medium uppercase tracking-tighter leading-none mb-12">
            {t("startJourney")}
          </h2>
          <Button
            size="lg"
            variant="secondary"
            className="h-16 px-12 rounded-full font-display uppercase tracking-widest text-sm hover:scale-105 transition-all duration-300"
            render={<Link href="/contact" />}
          >
            {tCommon("getInTouch")}
          </Button>
        </div>

        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
      </section>
    </div>
  );
}
