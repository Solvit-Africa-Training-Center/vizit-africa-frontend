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
      {/* ── Page header ───────────────────────────────────────────── */}
      <PageHeader
        overline={t("openStatus")}
        title={
          <>
            {t("title")}
            <span className="text-muted-foreground/30 block md:inline md:ml-3">
              {t("titleSub")}
            </span>
          </>
        }
        description={t("description")}
        layout="split"
        className="pt-24 md:pt-32"
      />

      {/* ── Contact cards ─────────────────────────────────────────── */}
      <section className="marketing-section pt-0">
        <div className="marketing-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
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

      {/* ── Form section ──────────────────────────────────────────── */}
      <section className="marketing-section bg-surface-cream border-t border-border/50">
        <div className="marketing-container">
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
            {/* Left: copy */}
            <div className="lg:col-span-5">
              <span className="label-overline mb-5 block">{t("formOverline")}</span>
              <h2 className="font-display text-4xl md:text-5xl font-light uppercase tracking-tight leading-[0.92] mb-7">
                {t("formTitle")}
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md text-pretty">
                {t("formDescription")}
              </p>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-7">
              <ContactForm t={t} tCommon={tCommon} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── ContactCard ─────────────────────────────────────────────────
// Hover: surface lifts slightly, icon gets primary bg, arrow animates
// No jarring dark-bg flip — stays in light system
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
    <div className="group flex flex-col p-7 rounded-2xl bg-card border border-border/50 hover:border-primary/25 hover:shadow-[0_8px_32px_oklch(65%_0.12_62/0.06)] transition-all duration-500 h-full relative overflow-hidden">
      {/* Icon */}
      <div className="size-11 rounded-xl bg-surface-cream border border-border/70 flex items-center justify-center mb-7 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
        <Icon className="size-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
      </div>

      <div className="mt-auto">
        {/* Label — primary mono per design guide */}
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary mb-3">
          {label}
        </p>
        <div className="flex items-start gap-1.5">
          <h3 className="font-display text-xl md:text-2xl font-light uppercase tracking-tight text-foreground leading-tight">
            {value}
          </h3>
          {href && (
            <RiArrowRightUpLine className="size-4 mt-1 text-muted-foreground/30 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-400 shrink-0" />
          )}
        </div>
        {sub && (
          <p className="text-sm text-muted-foreground/55 mt-1 font-light">
            {sub}
          </p>
        )}
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

// ── ContactForm ──────────────────────────────────────────────────
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
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
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
        toast.error(result.error || "Failed to send. Please try again.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
        <FormGroup
          label={t("firstName")}
          id="firstName"
          placeholder={t("firstNamePlaceholder")}
          name="firstName"
          required
        />
        <FormGroup
          label={t("lastName")}
          id="lastName"
          placeholder={t("lastNamePlaceholder")}
          name="lastName"
          required
        />
      </div>
      <FormGroup
        label={t("emailAddress")}
        id="email"
        type="email"
        placeholder={t("emailPlaceholder")}
        name="email"
        required
      />
      <FormGroup
        label={t("phoneNumber")}
        id="phone"
        type="tel"
        placeholder={t("phonePlaceholder")}
        name="phone"
      />

      {/* Message textarea */}
      <div className="space-y-3 group">
        <label
          htmlFor="message"
          className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-300"
        >
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={t("messagePlaceholder")}
          className={[
            "resize-none rounded-none px-0",
            "border-x-0 border-t-0 border-b border-border/50",
            "focus-visible:ring-0 focus-visible:border-primary",
            "text-lg bg-transparent shadow-none",
            "placeholder:text-muted-foreground/20 min-h-[100px] py-3",
            "transition-colors duration-300",
          ].join(" ")}
        />
      </div>

      <div className="pt-6">
        <Magnetic>
          <Button
            size="lg"
            type="submit"
            disabled={loading || success}
            className="w-full md:w-auto min-w-[220px] h-14 rounded-full text-xs group relative overflow-hidden px-10 btn-primary"
          >
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              {loading ? (
                <RiLoader4Line className="animate-spin" />
              ) : success ? (
                t("messages.success")
              ) : (
                <>
                  {tCommon("sendMessage")}
                  <RiArrowRightLine className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </Magnetic>
      </div>
    </form>
  );
}

// ── FormGroup ────────────────────────────────────────────────────
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
    <div className="space-y-3 group">
      <label
        htmlFor={id}
        className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-300"
      >
        {label}
        {/* Amber required asterisk — primary not primary */}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        required={required}
        type={type}
        placeholder={placeholder}
        className={[
          "rounded-none px-0",
          "border-x-0 border-t-0 border-b border-border/50",
          "focus-visible:ring-0 focus-visible:border-primary",
          "text-lg bg-transparent shadow-none h-11",
          "placeholder:text-muted-foreground/20",
          "transition-colors duration-300",
        ].join(" ")}
      />
    </div>
  );
}
