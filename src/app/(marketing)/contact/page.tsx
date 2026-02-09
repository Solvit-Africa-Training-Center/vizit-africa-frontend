"use client";

import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RiMailLine,
  RiMapPinLine,
  RiWhatsappLine,
  RiArrowRightLine,
  RiArrowRightUpLine,
} from "@remixicon/react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";
import { RevealText } from "@/components/ui/reveal-text";
import { Magnetic } from "@/components/ui/magnetic";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="lg:grid lg:grid-cols-2 min-h-screen">
          <div className="relative h-[60vh] lg:h-screen w-full bg-black text-white lg:sticky lg:top-0 flex flex-col justify-between overflow-hidden">
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
                  src="https://images.unsplash.com/photo-1596701725345-3dbd4d7a7836?q=90&w=2600&auto=format&fit=crop"
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-8">
                  <span className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-white/90">
                    Open for New Adventures
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight mb-6">
                  <RevealText text="Let's plan your" className="block" />
                  <span className="text-white/50">legacy trip.</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-md font-light leading-relaxed">
                  Have questions about our tours or need a custom itinerary?
                  We're here to help you plan the perfect experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="hidden lg:grid gap-8 p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
              >
                <ContactItem
                  icon={RiMailLine}
                  label="Email Us"
                  value="hello@vizitafrica.rw"
                  href="mailto:hello@vizitafrica.rw"
                />
                <ContactItem
                  icon={RiWhatsappLine}
                  label="WhatsApp"
                  value="+250 788 123 456"
                  href="https://wa.me/250788123456"
                />
                <ContactItem
                  icon={RiMapPinLine}
                  label="Visit Us"
                  value="Kigali Heights, 4th Floor"
                  sub="KG 7 Ave, Kigali, Rwanda"
                />
              </motion.div>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-background lg:min-h-screen">
            <div className="max-w-xl mx-auto w-full py-12 lg:py-0">
              <div className="mb-12">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Send us a message
                </h2>
                <p className="text-muted-foreground text-base">
                  Fill out the form below and our team will get back to you
                  within 24 hours.
                </p>
              </div>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
                  <FormGroup
                    label="First Name"
                    id="firstName"
                    placeholder="Jane"
                  />
                  <FormGroup
                    label="Last Name"
                    id="lastName"
                    placeholder="Doe"
                  />
                </div>

                <FormGroup
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                />

                <FormGroup
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />

                <div className="space-y-4 group">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your travel plans..."
                    className="resize-none border-x-0 border-t-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-lg transition-all duration-300 bg-transparent shadow-none placeholder:text-muted-foreground/30 min-h-[80px] py-3"
                  />
                </div>

                <div className="pt-8">
                  <Magnetic>
                    <Button
                      size="lg"
                      className="w-full h-16 rounded-full text-lg group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Send Message
                        <RiArrowRightLine className="size-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Magnetic>
                </div>
              </form>

              <div className="mt-20 lg:hidden space-y-8 pt-12 border-t border-border">
                <h3 className="font-display text-2xl font-bold">
                  Contact Details
                </h3>
                <div className="space-y-6">
                  <MobileContactItem
                    icon={RiMailLine}
                    label="Email"
                    value="hello@vizitafrica.rw"
                    href="mailto:hello@vizitafrica.rw"
                  />
                  <MobileContactItem
                    icon={RiWhatsappLine}
                    label="WhatsApp"
                    value="+250 788 123 456"
                    href="https://wa.me/250788123456"
                  />
                  <MobileContactItem
                    icon={RiMapPinLine}
                    label="Office"
                    value="Kigali Heights, 4th Floor"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactItem({ icon: Icon, label, value, href, sub }: any) {
  const Content = () => (
    <div className="flex items-start gap-4 group cursor-pointer">
      <div className="size-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="text-xs font-bold text-white/40 mb-1 uppercase tracking-widest">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xl font-display font-medium text-white group-hover:text-accent-warm transition-colors">
            {value}
          </p>
          {href && (
            <RiArrowRightUpLine className="size-4 text-white/20 group-hover:text-accent-warm group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>

        {sub && <p className="text-sm text-white/40 mt-1">{sub}</p>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <Content />
      </Link>
    );
  }

  return <Content />;
}

function MobileContactItem({ icon: Icon, label, value, href }: any) {
  const Content = () => (
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0">
        <Icon className="size-5 text-foreground" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-lg font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  if (href)
    return (
      <Link href={href}>
        <Content />
      </Link>
    );
  return <Content />;
}

function FormGroup({ label, id, type = "text", placeholder }: any) {
  return (
    <div className="space-y-4 group">
      <label
        htmlFor={id}
        className="text-sm font-medium uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="border-x-0 border-t-0 border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-lg transition-all duration-300 h-10 bg-transparent shadow-none placeholder:text-muted-foreground/30"
      />
    </div>
  );
}
