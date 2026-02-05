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
    <footer className="bg-zinc-900 text-white">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold text-white">
                Vizit Africa
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
              Your trusted Rwanda travel partner. Professional planning for
              unforgettable African experiences.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {footerLinks.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Vizit Africa. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">Made with ❤️ in Kigali</p>
        </div>
      </div>
    </footer>
  );
}
