"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RiGlobalLine, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  variant = "default",
}: {
  variant?: "default" | "light";
}) {
  const t = useTranslations("Languages");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "de", label: "Deutsch" },
    { code: "pt", label: "Português" },
    { code: "he", label: "עברית" },
    { code: "ar", label: "العربية" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
   variant={"ghost"}
   className={cn(variant === "light" && "text-primary-foreground")}
          />
        }
      >
        <RiGlobalLine />
        <span className="sr-only">Switch Language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="justify-between"
          >
            <span className={cn(lang.code === "ar" && "font-arabic")}>
              {t.has(lang.code) ? t(lang.code) : lang.label}
            </span>
            {locale === lang.code && (
              <RiCheckLine className="size-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
