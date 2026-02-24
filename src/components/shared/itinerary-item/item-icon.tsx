import {
  RiCarLine,
  RiFileListLine,
  RiHotelLine,
  RiPlaneLine,
  RiStickyNoteLine,
  RiUserLine,
} from "@remixicon/react";
import Image from "next/image";
import { BaseItem } from "./types";

export function ItemIcon({ item, type }: { item: BaseItem; type: string }) {
  const image =
    (item as any).data?.image ||
    (item as any).data?.airlineLogo ||
    "/images/rwanda-landscape.jpg";

  return (
    <div className="relative size-20 rounded-xl overflow-hidden bg-muted shrink-0 shadow-inner">
      {type === "note" ? (
        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
          <RiStickyNoteLine className="size-8" />
        </div>
      ) : (
        <Image src={image} alt={item.title ?? ""} fill className="object-cover" />
      )}
      <div className="absolute top-1 left-1">
        <div className="size-6 rounded-lg bg-background/90 backdrop-blur-xs flex items-center justify-center text-primary shadow-xs">
          {type === "flight" && <RiPlaneLine className="size-3.5" />}
          {type === "hotel" && <RiHotelLine className="size-3.5" />}
          {type === "car" && <RiCarLine className="size-3.5" />}
          {type === "guide" && <RiUserLine className="size-3.5" />}
          {type === "transport" && <RiCarLine className="size-3.5" />}
          {type === "note" && <RiStickyNoteLine className="size-3.5" />}
          {type === "other" && <RiFileListLine className="size-3.5" />}
        </div>
      </div>
    </div>
  );
}
