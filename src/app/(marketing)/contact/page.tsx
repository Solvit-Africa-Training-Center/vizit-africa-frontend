"use client";
import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiWhatsappLine,
  RiTimeLine,
  RiQuestionLine,
  RiArrowRightLine,
} from "@remixicon/react";
import Image from "next/image";
import { motion } from "motion/react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1596701725345-3dbd4d7a7836?q=90&w=2600&auto=format&fit=crop"
              alt="Contact Support"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 text-center text-white mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-white/80 font-mono uppercase tracking-widest text-sm md:text-base mb-4 block">
                We're Here For You
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                Have questions about your Rwanda trip? We're here to help you
                plan the perfect experience.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 md:px-10 py-24">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 ">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <RiMailLine className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email Us</p>
                      <a
                        href="mailto:hello@vizitafrica.rw"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        hello@vizitafrica.rw
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        Response within 2 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-accent-success/10 flex items-center justify-center shrink-0">
                      <RiWhatsappLine className="size-5 text-accent-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        WhatsApp Support
                      </p>
                      <a
                        href="https://wa.me/250788123456"
                        className="text-muted-foreground hover:text-accent-success transition-colors"
                      >
                        +250 788 123 456
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available 24/7
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <RiPhoneLine className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Call Us</p>
                      <a
                        href="tel:+250788123456"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +250 788 123 456
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mon-Sat, 8am - 6pm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <RiMapPinLine className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Visit Our Office
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Kigali Heights, 4th Floor
                        <br />
                        KG 7 Ave, Kigali, Rwanda
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-xl p-6 md:p-8 ">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <RiTimeLine className="size-5" />
                  Office Hours
                </h3>
                <div className="space-y-2 text-primary-foreground/90 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 ">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What can we help you with?"
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      className="bg-muted"
                      placeholder="Tell us about your travel plans or questions..."
                    />
                  </div>

                  <Button className="w-full md:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20">
                    Send Message
                    <RiArrowRightLine className="size-5" />
                  </Button>
                </form>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <a
                  href="/#faq"
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <span className="flex items-center gap-3 font-medium text-foreground">
                    <RiQuestionLine className="size-5 text-primary" />
                    Read our FAQs
                  </span>
                  <RiArrowRightLine className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="mailto:support@vizitafrica.rw"
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <span className="flex items-center gap-3 font-medium text-foreground">
                    <RiMailLine className="size-5 text-primary" />
                    Support Center
                  </span>
                  <RiArrowRightLine className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
