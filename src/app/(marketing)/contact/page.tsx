import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiWhatsappLine,
  RiTimeLine,
  RiQuestionLine,
  RiArrowRightLine,
} from "@remixicon/react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-50 pt-20">
        {/* Hero Section */}
        <section className="bg-primary-subtle py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have questions about your Rwanda trip? We're here to help you plan
              the perfect experience. Reach out to us directly or fill out the
              form below.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 md:px-10 py-12 md:py-20">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
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
                      <p className="text-muted-foreground">
                        Kigali Heights, 4th Floor
                        <br />
                        KG 7 Ave, Kigali, Rwanda
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-lg p-6 md:p-8">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <RiTimeLine className="size-5" />
                  Office Hours
                </h3>
                <div className="space-y-2 text-primary-foreground/90">
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

            {/* Contact Form - Right Column */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about your travel plans or questions..."
                    />
                  </div>

                  <Button className="w-full md:w-auto h-12 px-8 text-base">
                    Send Message
                    <RiArrowRightLine className="ml-2 size-5" />
                  </Button>
                </form>
              </div>

              {/* Quick Links */}
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <span className="flex items-center gap-3 font-medium text-foreground">
                    <RiQuestionLine className="size-5 text-primary" />
                    Read our FAQs
                  </span>
                  <RiArrowRightLine className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:border-primary/50 transition-colors group"
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
