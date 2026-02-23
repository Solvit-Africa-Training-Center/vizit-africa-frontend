import React from "react";
import { RiAlertLine, RiCheckLine, RiErrorWarningLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export interface ValidationAlert {
  errors: string[];
  warnings: string[];
}

interface ValidationAlertBannerProps {
  validation: ValidationAlert;
  onDismiss?: () => void;
}

export function ValidationAlertBanner({
  validation,
  onDismiss,
}: ValidationAlertBannerProps) {
  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  if (!hasErrors && !hasWarnings) {
    return null;
  }

  return (
    <div
      className={`rounded-lg border p-4 mb-6 ${
        hasErrors
          ? "bg-destructive/10 border-destructive/30"
          : "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {hasErrors ? (
            <RiErrorWarningLine className="size-5 text-destructive" />
          ) : (
            <RiAlertLine className="size-5 text-yellow-600 dark:text-yellow-500" />
          )}
        </div>
        <div className="flex-1">
          {hasErrors && (
            <div>
              <h3 className="font-semibold text-destructive mb-2">
                Fix {validation.errors.length} error
                {validation.errors.length !== 1 ? "s" : ""} before sending
              </h3>
              <ul className="space-y-1 text-sm text-destructive/90 mb-3">
                {validation.errors.map((error, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasWarnings && (
            <div>
              <h3 className="font-semibold text-yellow-700 dark:text-yellow-600 mb-2">
                {validation.warnings.length} warning
                {validation.warnings.length !== 1 ? "s" : ""}
              </h3>
              <ul className="space-y-1 text-sm text-yellow-700/80 dark:text-yellow-600/80">
                {validation.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">
                      →
                    </span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 shrink-0"
          >
            <RiAlertLine className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

interface ValidationBadgeProps {
  errorCount?: number;
  warningCount?: number;
  compact?: boolean;
}

export function ValidationBadge({
  errorCount = 0,
  warningCount = 0,
  compact = false,
}: ValidationBadgeProps) {
  if (errorCount === 0 && warningCount === 0) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-medium">
        <RiCheckLine className="size-3" />
        {!compact && "Valid"}
      </div>
    );
  }

  if (errorCount > 0) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs font-medium">
        <RiErrorWarningLine className="size-3" />
        {!compact && `${errorCount} error${errorCount !== 1 ? "s" : ""}`}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-600 text-xs font-medium">
      <RiAlertLine className="size-3" />
      {!compact && `${warningCount} warning${warningCount !== 1 ? "s" : ""}`}
    </div>
  );
}
