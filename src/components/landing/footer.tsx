import Link from "next/link";
import {
  RiTwitterXLine,
  RiInstagramLine,
  RiFacebookLine,
  RiLinkedinLine,
} from "@remixicon/react";

const footerLinks = {
  services: [
    { label: "Trips & Packages", href: "/experiences" },
    { label: "Custom Itineraries", href: "/plan-trip" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/#faq" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  contact: [
    { label: "hello@vizitafrica.rw", href: "mailto:hello@vizitafrica.rw" },
    { label: "+250 788 000 000", href: "tel:+250788000000" },
    { label: "WhatsApp", href: "https://wa.me/250788000000" },
  ],
};

const socialLinks = [
  { icon: RiTwitterXLine, href: "https://twitter.com", label: "Twitter" },
  { icon: RiInstagramLine, href: "https://instagram.com", label: "Instagram" },
  { icon: RiFacebookLine, href: "https://facebook.com", label: "Facebook" },
  { icon: RiLinkedinLine, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="bg-black text-white py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24">
          <div className="md:col-span-5 lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl font-bold uppercase tracking-tight text-white">
                Vizit Africa
              </span>
            </Link>
            <p className="text-base text-gray-400 leading-relaxed max-w-sm font-light">
              Your trusted Rwanda travel partner. Professional planning for
              unforgettable African experiences.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="size-10 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <social.icon className="size-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-8">
                Explore
              </h4>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-8">
                Company
              </h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-8">
                Contact
              </h4>
              <ul className="space-y-4">
                {footerLinks.contact.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            © 2025 Vizit Africa. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
