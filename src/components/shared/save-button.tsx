"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RiHeartLine, RiHeartFill, RiLoader4Line } from "@remixicon/react";
import { saveItem, removeItem } from "@/actions/accounts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SaveButtonProps {
  type: string;
  id: string;
  isSaved?: boolean;
  className?: string;
  variant?: "icon" | "full";
  onToggle?: (newState: boolean) => void;
}

export function SaveButton({
  type,
  id,
  isSaved = false,
  className,
  variant = "icon",
  onToggle,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      // Optimistic update
      const newState = !saved;
      setSaved(newState);

      const result = newState
        ? await saveItem(type, id)
        : await removeItem(type, id);

      if (!result.success) {
        // Revert on failure
        setSaved(!newState);
        toast.error(result.error || "Failed to update saved item");
      } else {
        toast.success(newState ? "Item saved" : "Item removed");
        onToggle?.(newState);
      }
    } catch (error) {
      setSaved(!saved);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        onClick={handleToggle}
        disabled={loading}
        className={cn("gap-2 px-2", className)}
      >
        {loading ? (
          <RiLoader4Line className="size-4 animate-spin" />
        ) : saved ? (
          <RiHeartFill className="size-4 text-red-500" />
        ) : (
          <RiHeartLine className="size-4" />
        )}
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10",
        saved ? "text-red-500" : "text-muted-foreground",
        className,
      )}
      aria-label={saved ? "Unsave" : "Save"}
    >
      {loading ? (
        <RiLoader4Line className="size-5 animate-spin" />
      ) : saved ? (
        <RiHeartFill className="size-5" />
      ) : (
        <RiHeartLine className="size-5" />
      )}
    </button>
  );
}
