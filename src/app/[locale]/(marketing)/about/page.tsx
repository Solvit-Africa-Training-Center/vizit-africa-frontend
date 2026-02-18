import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { members as teamMembers } from "@/lib/configs/members";
import { getTranslations } from "next-intl/server";



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
      
           className="mb-32 md:mb-48"
        />

        <section className="max-w-7xl mx-auto px-5 md:px-10 mb-32 md:mb-48">
          <div className="">
            <div className="md:col-span-8 md:col-start-3">
              <p className="font-display text-2xl md:text-3xl font-medium leading-tight">
                <span className="text-primary">{t("intro1")}</span>{" "}
                {t("intro2")}
              </p>
              <p className="font-display text-2xl md:text-3xl font-medium leading-tight mt-12 text-muted-foreground/60">
                {t("intro3")}
              </p>
            </div>
          </div>
        </section>

        <section
       
          className="mb-32 md:mb-48 overflow-hidden py-12 max-w-7xl px-5 md:px-10 mx-auto"
        >
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-display text-2xl md:text-4xl font-medium uppercase">
              {t("guidesTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xs text-right hidden md:block">
              {t("guidesDescription")}
            </p>
          </div>

          <div className="">
            <div
              className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {teamMembers.map((member, i) => (
                <div
                  key={member.id}
                  className="relative group flex flex-col gap-2"
                >
                  <div className="relative h-80 w-full">
                    <Image
                      src={
                        [
                          "/images/guide.jpg",
                          "/images/guide-with-walkie-talkie.jpg",
                          "/images/woman-smiling-in-window--black-white.jpg",
                          "/images/marco-lopez.jpg",
                        ][i % 4]
                      }
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

        <section className="px-5 md:px-10 max-w-7xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tight mb-8">
            {t("startJourney")}
          </h2>
          <a href="/contact" className="inline-block relative group">
            <span className="font-mono text-lg uppercase tracking-widest text-foreground group-hover:text-primary transition-colors duration-300">
              {tCommon("getInTouch")}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-foreground group-hover:bg-primary transition-colors duration-300 origin-left group-hover:scale-x-100" />
          </a>
        </section>
      </div>
  );
}
