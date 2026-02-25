"use client";

import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiLoader4Line,
  RiMailLine,
  RiMapPinLine,
  RiWhatsappLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Magnetic } from "@/components/ui/magnetic";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/configs";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tCommon = useTranslations("Common");

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        overline={t("openStatus")}
        title={
          <>
            {t("title")}
            <span className="text-muted-foreground/40 block md:inline md:ml-4">
              {t("titleSub")}
            </span>
          </>
        }
        description={t("description")}
        layout="split"
        className="pt-24 md:pt-32"
      />

      <section className="marketing-section pt-0">
        <div className="marketing-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <ContactCard
              icon={RiMailLine}
              label={t("emailUs")}
              value={siteConfig.contact.email}
              href={`mailto:${siteConfig.contact.email}`}
            />
            <ContactCard
              icon={RiWhatsappLine}
              label={t("whatsapp")}
              value={siteConfig.contact.phone}
              href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, "")}`}
            />
            <ContactCard
              icon={RiMapPinLine}
              label={t("visitUs")}
              value={t("address")}
              sub={t("addressSub")}
            />
          </div>
        </div>
      </section>

      <section className="marketing-section bg-muted/30 border-t border-border/50">
        <div className="marketing-container">
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl md:text-5xl font-medium uppercase tracking-tighter leading-[0.9] mb-8">
                {t("formTitle")}
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-md text-pretty">
                {t("formDescription")}
              </p>
            </div>

            <div className="lg:col-span-7">
              <ContactForm t={t} tCommon={tCommon} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  sub,
}: {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  sub?: string;
}) {
  const Content = () => (
    <div className="group flex flex-col p-8 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-500 h-full">
      <div className="size-12 rounded-xl bg-background border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
        <Icon className="size-6 text-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <div className="mt-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          {label}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl md:text-2xl font-display font-medium uppercase tracking-tight group-hover:text-primary transition-colors">
            {value}
          </h3>
          {href && (
            <RiArrowRightUpLine className="size-5 text-muted-foreground/30 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
          )}
        </div>
        {sub && <p className="text-sm text-muted-foreground/60">{sub}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        className="block h-full"
      >
        <Content />
      </a>
    );
  }

  return <Content />;
}

function ContactForm({
  t,
  tCommon,
}: {
  t: (k: string) => string;
  tCommon: (k: string) => string;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      name:
        (formData.get("firstName") as string) +
        " " +
        (formData.get("lastName") as string),
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      subject: "New Contact Form Message",
    };

    try {
      const { sendContactMessage } = await import("@/actions/accounts");
      const result = await sendContactMessage(payload);

      if (result.success) {
        setSuccess(true);
        toast.success("Message sent successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(
          result.error || "Failed to send message. Please try again.",
        );
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-12" onSubmit={onSubmit}>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-12">
        <FormGroup
          label={t("firstName")}
          id="firstName"
          placeholder="Jane"
          name="firstName"
          required
        />
        <FormGroup
          label={t("lastName")}
          id="lastName"
          placeholder="Doe"
          name="lastName"
          required
        />
      </div>

      <FormGroup
        label={t("emailAddress")}
        id="email"
        type="email"
        placeholder="jane@example.com"
        name="email"
        required
      />

      <FormGroup
        label={t("phoneNumber")}
        id="phone"
        type="tel"
        placeholder="+1 (555) 000-0000"
        name="phone"
      />

      <div className="space-y-4 group">
        <label
          htmlFor="message"
          className="text-xs font-mono uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
        >
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={t("messagePlaceholder")}
          className="resize-none border-x-0 border-t-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-xl transition-all duration-300 bg-transparent shadow-none placeholder:text-muted-foreground/20 min-h-[100px] py-4"
        />
      </div>

      <div className="pt-8">
        <Magnetic>
          <Button
            size="lg"
            type="submit"
            disabled={loading || success}
            className="w-full md:w-auto min-w-[240px] h-16 rounded-full text-lg group relative overflow-hidden px-10"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <RiLoader4Line className="animate-spin" />
              ) : success ? (
                "Message Sent"
              ) : (
                tCommon("sendMessage")
              )}
              {!loading && !success && (
                <RiArrowRightLine className="size-5 group-hover:translate-x-1 transition-transform" />
              )}
            </span>
          </Button>
        </Magnetic>
      </div>
    </form>
  );
}

function FormGroup({
  label,
  id,
  type = "text",
  placeholder,
  name,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-4 group">
      <label
        htmlFor={id}
        className="text-xs font-mono uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors"
      >
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        required={required}
        type={type}
        placeholder={placeholder}
        className="border-x-0 border-t-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-xl transition-all duration-300 h-12 bg-transparent shadow-none placeholder:text-muted-foreground/20"
      />
    </div>
  );
}
