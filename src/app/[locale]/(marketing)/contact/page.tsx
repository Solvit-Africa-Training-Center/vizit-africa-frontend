"use client";

import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiLoader4Line,
  RiMailLine,
  RiMapPinLine,
  RiWhatsappLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Magnetic } from "@/components/ui/magnetic";
import { RevealText } from "@/components/ui/reveal-text";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tCommon = useTranslations("Common");

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:grid lg:grid-cols-2 min-h-screen">
        <div className="relative h-[60vh] lg:h-screen w-full bg-black text-primary-foreground lg:sticky lg:top-0 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-full h-full"
            >
              <Image
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=90&w=2600&auto=format&fit=crop"
                alt="Contact Background"
                fill
                className="object-cover opacity-60"
                priority
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/20 lg:to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-12 lg:p-20 flex flex-col h-full justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-20 lg:mt-0"
            >
              <PageHeader
                theme="dark"
                className="p-0 mb-0 max-w-none"
                overline={
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-primary-foreground/90">
                      {t("openStatus")}
                    </span>
                  </div>
                }
                title={
                  <>
                    <RevealText text={t("title")} className="block" />
                    <span className="text-primary-foreground/50">
                      {t("titleSub")}
                    </span>
                  </>
                }
                description={t("description")}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:grid gap-8 p-8 bg-primary-foreground/5 backdrop-blur-xl rounded-3xl border border-white/10"
            >
              <ContactItem
                icon={RiMailLine}
                label={t("emailUs")}
                value="hello@vizitafrica.rw"
                href="mailto:hello@vizitafrica.rw"
              />
              <ContactItem
                icon={RiWhatsappLine}
                label={t("whatsapp")}
                value="+250 788 123 456"
                href="https://wa.me/250788123456"
              />
              <ContactItem
                icon={RiMapPinLine}
                label={t("visitUs")}
                value={t("address")}
                sub={t("addressSub")}
              />
            </motion.div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-background lg:min-h-screen">
          <div className="max-w-xl mx-auto w-full py-12 lg:py-0">
            <div className="mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-medium mb-3">
                {t("formTitle")}
              </h2>
              <p className="text-muted-foreground text-base">
                {t("formDescription")}
              </p>
            </div>

            <ContactForm t={t} tCommon={tCommon} />

            <div className="mt-20 lg:hidden space-y-8 pt-12 border-t border-border">
              <h3 className="font-display text-2xl font-medium">
                {t("contactDetails")}
              </h3>
              <div className="space-y-6">
                <MobileContactItem
                  icon={RiMailLine}
                  label={t("emailUs")}
                  value="hello@vizitafrica.rw"
                  href="mailto:hello@vizitafrica.rw"
                />
                <MobileContactItem
                  icon={RiWhatsappLine}
                  label={t("whatsapp")}
                  value="+250 788 123 456"
                  href="https://wa.me/250788123456"
                />
                <MobileContactItem
                  icon={RiMapPinLine}
                  label={t("office")}
                  value={t("address")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Translate = (key: string) => string;

function ContactForm({ t, tCommon }: { t: Translate; tCommon: Translate }) {
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
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
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
          className="text-sm font-medium uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors"
        >
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={t("messagePlaceholder")}
          className="resize-none border-x-0 border-t-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-lg transition-all duration-300 bg-transparent shadow-none placeholder:text-muted-foreground/30 min-h-[80px] py-3"
        />
      </div>

      <div className="pt-8">
        <Magnetic>
          <Button
            size="lg"
            type="submit"
            disabled={loading || success}
            className="w-full h-16 rounded-full text-lg group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
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

interface ContactItemProps {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  sub?: string;
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  sub,
}: ContactItemProps) {
  const Content = () => (
    <div className="flex items-start gap-4 group cursor-pointer">
      <div className="size-12 rounded-full bg-primary-foreground/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary-foreground/20 transition-all duration-300">
        <Icon className="size-5 text-primary-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-primary-foreground/40 mb-1 uppercase tracking-widest">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-display font-medium text-primary-foreground group-hover:text-accent-warm transition-colors">
            {value}
          </p>
          {href && (
            <RiArrowRightUpLine className="size-4 text-primary-foreground/20 group-hover:text-accent-warm group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>

        {sub && (
          <p className="text-sm text-primary-foreground/40 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel="noreferrer"
      >
        <Content />
      </a>
    );
  }

  return <Content />;
}

interface MobileContactItemProps {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}

function MobileContactItem({
  icon: Icon,
  label,
  value,
  href,
}: MobileContactItemProps) {
  const Content = () => (
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Icon className="size-5 text-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-lg font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel="noreferrer"
      >
        <Content />
      </a>
    );
  }
  return <Content />;
}

interface FormGroupProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

function FormGroup({
  label,
  id,
  type = "text",
  placeholder,
  name,
  required,
}: FormGroupProps) {
  return (
    <div className="space-y-4 group">
      <label
        htmlFor={id}
        className="text-sm font-medium uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        required={required}
        type={type}
        placeholder={placeholder}
        className="border-x-0 border-t-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-lg transition-all duration-300 h-10 bg-transparent shadow-none placeholder:text-muted-foreground/30"
      />
    </div>
  );
}
