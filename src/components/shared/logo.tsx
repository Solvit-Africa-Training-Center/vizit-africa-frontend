import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
}

const Logo = ({ variant = "default", className }: LogoProps) => {
  return (
    <Link href="/" className={cn("block relative", className)}>
      <Image
        src="/logo.svg"
         aria-label="Vizit Africa Home"
            alt="Vizit Africa Logo"
        width={100}
        height={100}
        className={cn(
          "w-auto h-8 shrink-0 hover:opacity-75 active:opacity-60 md:h-10 transition-all duration-300",
          variant === "light" && "brightness-0 invert",
        )}
      />
    </Link>
  );
};

export default Logo;
