import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  overline?: string;
  description?: React.ReactNode;
  /**
   * "default"  — single-column left-aligned (About, Services, Gallery…)
   * "split"    — left title + right children slot (Contact, Experiences…)
   */
  layout?: "default" | "split";
  children?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader — shared editorial header for all inner pages.
 *
 * Design rules:
 * - Overline always uses `.label-overline` (primary mono, with left tick)
 * - Title always Cormorant, font-light, tight leading, uppercase
 * - Bottom border is 1px primary/10 — a quiet primary horizon
 * - No icons, no decorations, no background tints — pure type
 */
export function PageHeader({
  title,
  overline,
  description,
  layout = "default",
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "pt-12 pb-8 md:pt-16 md:pb-10",
        "border-b border-primary/10",
        className,
      )}
    >
      <div className="marketing-container">
        {layout === "split" ? (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16">
            {/* ── Left: overline + title + optional description ── */}
            <div className="flex-1 max-w-2xl">
              {overline && (
                <span className="text-primary mb-4 block">{overline}</span>
              )}
              <h1 className="font-display text-4xl md:text-[3rem] lg:text-[3.5rem] font-light tracking-tight leading-[0.92] uppercase">
                {title}
              </h1>
              {description && (
                <p className="mt-5 text-lg font-light text-muted-foreground leading-relaxed max-w-xl text-pretty">
                  {description}
                </p>
              )}
            </div>

            {/* ── Right: optional children slot ── */}
            {children && (
              <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-3 pb-0.5">
                {children}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl">
            {overline && (
              <span className="label-overline mb-5 block">{overline}</span>
            )}
            <h1 className="font-display text-4xl md:text-[3rem] lg:text-[3.5rem] font-light tracking-tight leading-[0.92] uppercase">
              {title}
            </h1>
            {description && (
              <p className="mt-5 text-xl font-light text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                {description}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
