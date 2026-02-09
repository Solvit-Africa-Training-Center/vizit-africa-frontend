"use client";

import {
  RiTwitterXLine,
  RiInstagramLine,
  RiFacebookLine,
  RiLinkedinLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "../shared";

const socialLinks = [
  { icon: RiTwitterXLine, href: "https://twitter.com", label: "Twitter" },
  { icon: RiInstagramLine, href: "https://instagram.com", label: "Instagram" },
  { icon: RiFacebookLine, href: "https://facebook.com", label: "Facebook" },
  { icon: RiLinkedinLine, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  const t = useTranslations("Footer");

  const footerLinks = {
    services: [
      { label: t("links.tripsPackages"), href: "/experiences" },
      { label: t("links.customItineraries"), href: "/plan-trip" },
      { label: t("links.gallery"), href: "/gallery" },
      { label: t("links.faq"), href: "/#faq" },
    ],
    company: [
      { label: t("links.aboutUs"), href: "/about" },
      { label: t("links.contactUs"), href: "/contact" },
      { label: t("links.privacyPolicy"), href: "/privacy" },
      { label: t("links.termsOfService"), href: "/terms" },
    ],
    contact: [
      { label: "hello@vizitafrica.rw", href: "mailto:hello@vizitafrica.rw" },
      { label: "+250 788 000 000", href: "tel:+250788000000" },
      { label: "WhatsApp", href: "https://wa.me/250788000000" },
    ],
  };

  return (
    <footer
      id="main-footer"
      className="bg-black text-white py-24 border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24">
          <div className="md:col-span-5 lg:col-span-4 space-y-8">
              <Logo variant="light" />
            <p className="text-base text-gray-400 leading-relaxed max-w-sm font-light">
              {t("tagline")}
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
                {t("explore")}
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
                {t("company")}
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
                {t("contact")}
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
            {t("copyright")}
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-white uppercase tracking-wider transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
