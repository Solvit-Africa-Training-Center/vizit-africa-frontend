"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { 
  RiSparkling2Line, 
  RiArrowRightLine, 
  RiHistoryLine, 
  RiMapPinLine, 
  RiUser3Line,
  RiCalendarLine,
  RiHotelLine,
  RiCarLine,
  RiUserStarLine,
  RiCheckLine,
  RiAddLine
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTripStore } from "@/store/trip-store";
import { motion, AnimatePresence } from "motion/react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const aiSchema = z.object({
  destination: z.string(),
  itinerarySummary: z.string(),
  totalEstimatedBudget: z.number(),
  hotels: z.array(z.object({
    id: z.string(),
    name: z.string(),
    pricePerNight: z.number(),
    location: z.string(),
    description: z.string().optional()
  })),
  cars: z.array(z.object({
    id: z.string(),
    model: z.string(),
    pricePerDay: z.number(),
    category: z.string(),
    description: z.string().optional()
  })),
  guides: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    type: z.string(),
    description: z.string().optional()
  })),
});

export default function AiTripClient() {
  const t = useTranslations("PlanTrip");
  const router = useRouter();
  const { tripInfo, addItem, items, updateTripInfo } = useTripStore();
  
  const [localInfo, setLocalInfo] = useState({
    destination: tripInfo.destination || "",
    startDate: tripInfo.arrivalDate || "",
    endDate: tripInfo.departureDate || "",
    travelers: tripInfo.travelers || 2,
  });

  const [isGenerated, setIsGenerated] = useState(false);

  const { object, submit, isLoading } = useObject({
    api: "/api/ai",
    schema: aiSchema,
    onFinish: ({ object }) => {
      if (object) {
        setIsGenerated(true);
        toast.success("AI Intelligence applied!");
      }
    },
  });

  const handleGenerate = () => {
    if (!localInfo.destination || !localInfo.startDate || !localInfo.endDate) {
      toast.error("Please provide destination and dates.");
      return;
    }

    updateTripInfo({
      destination: localInfo.destination,
      arrivalDate: localInfo.startDate,
      departureDate: localInfo.endDate,
      travelers: localInfo.travelers,
    });

    submit({
      destination: localInfo.destination,
      startDate: localInfo.startDate,
      endDate: localInfo.endDate,
      groupSize: localInfo.travelers,
      tripPurpose: tripInfo.tripPurpose,
      specialRequests: tripInfo.specialRequests,
    });
  };

  const isSelected = (id: string) => items.some(i => i.id.toString().includes(id));

  const handleAddItem = (type: string, item: any) => {
    addItem({
      id: `ai-${type}-${item.id}`,
      type: type as any,
      title: item.name || item.model,
      description: item.description || item.location || item.type,
      price: item.pricePerNight || item.pricePerDay || item.price,
      quantity: 1,
    });
    toast.success(`${item.name || item.model} added to your journey`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Top Section: Refine Context */}
      <section className="bg-card border border-border rounded-[2.5rem] p-4 md:p-6 shadow-2xl shadow-primary/5">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="lg:border-r border-border/50 pr-6 hidden lg:block">
            <h3 className="font-display text-lg font-medium whitespace-nowrap">Refine Context</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Intelligent Input</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 w-full">
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 ml-1">Destination</Label>
              <div className="relative">
                <RiMapPinLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
                <Input 
                  value={localInfo.destination}
                  onChange={(e) => setLocalInfo({...localInfo, destination: e.target.value})}
                  className="pl-9 bg-muted/20 border-border/40 h-12 rounded-2xl"
                  placeholder="Where to?"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 ml-1">Timeline</Label>
              <div className="flex items-center gap-2 bg-muted/20 border border-border/40 rounded-2xl px-3 h-12">
                <RiCalendarLine className="size-4 text-muted-foreground/40 shrink-0" />
                <input 
                  type="date"
                  value={localInfo.startDate}
                  onChange={(e) => setLocalInfo({...localInfo, startDate: e.target.value})}
                  className="bg-transparent border-none text-xs focus:ring-0 w-full p-0"
                />
                <span className="text-muted-foreground/20">—</span>
                <input 
                  type="date"
                  value={localInfo.endDate}
                  onChange={(e) => setLocalInfo({...localInfo, endDate: e.target.value})}
                  className="bg-transparent border-none text-xs focus:ring-0 w-full p-0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60 ml-1">Adventurers</Label>
              <div className="relative">
                <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  type="number"
                  value={localInfo.travelers}
                  onChange={(e) => setLocalInfo({...localInfo, travelers: Number(e.target.value)})}
                  className="pl-9 bg-muted/20 border-border/40 h-12 rounded-2xl"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={isLoading}
                className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/20"
              >
                {isLoading ? <Spinner className="size-4 mr-2" /> : <RiSparkling2Line className="size-4 mr-2" />}
                {isGenerated ? "Refresh Vision" : "Generate Journey"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Recommendations */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {!isGenerated && !isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/5"
            >
              <div className="size-24 bg-card rounded-3xl shadow-xl shadow-primary/5 flex items-center justify-center mb-8 border border-border/50">
                <RiSparkling2Line className="size-12 text-primary/40" />
              </div>
              <h3 className="text-3xl font-display font-medium mb-4">Crafting Local Excellence</h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Set your journey context above and let our concierge AI 
                architect a narrative tailored to your unique style.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {isLoading && (
                <div className="flex flex-col items-center gap-8 py-40">
                  <div className="relative">
                    <Spinner className="size-20 text-primary opacity-20" />
                    <RiSparkling2Line className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-primary animate-pulse" />
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-foreground font-display text-2xl">Intelligence in Progress</p>
                    <p className="text-muted-foreground animate-pulse font-mono text-[10px] uppercase tracking-[0.4em]">
                      Decoding the finest of {localInfo.destination}...
                    </p>
                  </div>
                </div>
              )}

              {object && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-20 pb-20"
                >
                  {/* Summary Section */}
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Badge variant="outline" className="uppercase tracking-[0.3em] text-[10px] py-1.5 px-4 border-primary/30 text-primary rounded-full">
                      The Narrative Vision
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-display font-medium leading-[1.1] tracking-tight">
                      {object.itinerarySummary}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 pt-4">
                      <span className="flex items-center gap-2 text-primary"><RiMapPinLine className="size-4" /> {object.destination}</span>
                      <span className="flex items-center gap-2"><RiUser3Line className="size-4" /> {localInfo.travelers} Adventurers</span>
                      <span className="bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/10">Total Est. ${object.totalEstimatedBudget?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-20">
                      {/* Hotels Section */}
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-border/50" />
                          <h3 className="font-display text-2xl font-medium flex items-center gap-3 px-4">
                            <RiHotelLine className="size-6 text-primary" /> Stays
                          </h3>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8">
                          {object.hotels?.map((hotel: any) => (
                            <RecommendationCard 
                              key={hotel.id}
                              title={hotel.name}
                              subtitle={hotel.location}
                              price={`$${hotel.pricePerNight}/night`}
                              description={hotel.description}
                              isSelected={isSelected(hotel.id)}
                              onAdd={() => handleAddItem("hotel", hotel)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Transport Section */}
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-border/50" />
                          <h3 className="font-display text-2xl font-medium flex items-center gap-3 px-4">
                            <RiCarLine className="size-6 text-primary" /> Logistics
                          </h3>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8">
                          {object.cars?.map((car: any) => (
                            <RecommendationCard 
                              key={car.id}
                              title={car.model}
                              subtitle={car.category}
                              price={`$${car.pricePerDay}/day`}
                              description={car.description}
                              isSelected={isSelected(car.id)}
                              onAdd={() => handleAddItem("car", car)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Guides Section */}
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-border/50" />
                          <h3 className="font-display text-2xl font-medium flex items-center gap-3 px-4">
                            <RiUserStarLine className="size-6 text-primary" /> Experts
                          </h3>
                          <div className="h-px flex-1 bg-border/50" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8">
                          {object.guides?.map((guide: any) => (
                            <RecommendationCard 
                              key={guide.id}
                              title={guide.name}
                              subtitle={guide.type}
                              price={`$${guide.price}/total`}
                              description={guide.description}
                              isSelected={isSelected(guide.id)}
                              onAdd={() => handleAddItem("guide", guide)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <aside className="lg:col-span-4 sticky top-32">
                      <div className="bg-foreground text-background rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                          <RiSparkling2Line className="size-32" />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                          <h3 className="font-display text-2xl font-medium">Narrative Summary</h3>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Selections</span>
                              <Badge variant="secondary" className="bg-white/10 text-white border-none">{items.length} Items</Badge>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Concierge Fee</span>
                              <span className="text-xs font-bold">Included</span>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button 
                              size="lg" 
                              onClick={() => router.push("/plan-trip")} 
                              className="w-full rounded-2xl h-16 text-lg bg-white text-black hover:bg-white/90 shadow-xl"
                            >
                              Finalize Narrative
                              <RiArrowRightLine className="ml-2 size-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              onClick={() => router.push("/plan-trip")}
                              className="w-full mt-4 text-white/40 hover:text-white hover:bg-transparent text-[10px] uppercase font-bold tracking-widest"
                            >
                              Continue to Manual Builder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RecommendationCard({ title, subtitle, price, description, isSelected, onAdd }: any) {
  return (
    <div className={cn(
      "group p-6 rounded-3xl border transition-all duration-500 flex flex-col justify-between h-full bg-card shadow-xs",
      isSelected ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/5" : "border-border/50 hover:border-primary/30"
    )}>
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h4 className="font-display text-lg font-medium truncate leading-tight">{title}</h4>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{subtitle}</p>
          </div>
          <p className="text-sm font-bold text-primary whitespace-nowrap">{price}</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">
          {description || "A curated selection based on your specific travel profile and desired trip vibe."}
        </p>
      </div>

      <div className="pt-6">
        <Button 
          variant={isSelected ? "secondary" : "outline"} 
          className={cn(
            "w-full rounded-2xl h-11 text-xs font-bold uppercase tracking-widest transition-all",
            isSelected && "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
          )}
          onClick={onAdd}
          disabled={isSelected}
        >
          {isSelected ? (
            <>
              <RiCheckLine className="size-4 mr-2" />
              Added to Journey
            </>
          ) : (
            <>
              <RiAddLine className="size-4 mr-2" />
              Add to Narrative
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
