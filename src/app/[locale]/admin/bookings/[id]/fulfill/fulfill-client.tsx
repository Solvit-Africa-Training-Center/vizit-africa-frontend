"use client";

import {
  RiArrowLeftLine,
  RiCarLine,
  RiCheckDoubleLine,
  RiDownloadLine,
  RiFileListLine,
  RiHotelLine,
  RiMailSendLine,
  RiPlaneLine,
  RiRefundLine,
  RiInformationLine,
  RiCheckLine,
  RiSuitcaseLine,
  RiUserLine,
  RiCalendarLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { RefundModal } from "@/components/shared/payment";
import { Link, useRouter } from "@/i18n/navigation";
import { type Booking } from "@/lib/unified-types";
import { formatDate, cn } from "@/lib/utils";
import { updateBooking } from "@/actions/bookings";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FulfillClientProps {
  booking: Booking;
}

export default function FulfillClient({ booking: initialBooking }: FulfillClientProps) {
  const t = useTranslations("Admin.bookings.fulfill");
  const router = useRouter();
  const [booking, setBooking] = useState(initialBooking);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [checklist, setChecklist] = useState({
    flightTickets: false,
    hotelConfirmation: false,
    carVoucher: false,
    guideItinerary: false,
    finalItinerarySent: false,
  });

  const toggleItem = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const progress =
    (Object.values(checklist).filter(Boolean).length /
      Object.keys(checklist).length) *
    100;

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await updateBooking(String(booking.id), { status: "completed" });
      if (result.success) {
        setBooking(result.data);
        toast.success("Booking marked as completed!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to complete booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 md:px-10 py-8">
      <div className="mb-10">
        <Link
          href="/admin/bookings"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-all flex items-center gap-1.5 mb-6 group"
        >
          <RiArrowLeftLine className="size-4 group-hover:-translate-x-1" /> {t("back")}
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">
                Fulfillment Narrative
              </h1>
              <Badge 
                variant={booking.status === "completed" ? "success" : "warning"}
                className="uppercase tracking-wider px-2.5 py-0.5"
              >
                {booking.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Reference #{String(booking.id).toUpperCase().substring(0, 8)} •{" "}
              {booking.tripPurpose || "Trip"} for {booking.name}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full gap-2">
              <RiDownloadLine className="size-4" /> {t("downloadInvoice")}
            </Button>
            
            {booking.status !== "completed" && booking.status !== "cancelled" && (
              <Button
                variant="destructive"
                className="rounded-full gap-2"
                onClick={() => setShowRefundModal(true)}
              >
                <RiRefundLine className="size-4" />
                Refund & Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Progress Tracker */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h3 className="font-display text-xl font-medium">{t("progress.title")}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Logistics Readiness</p>
              </div>
              <span className="font-mono text-2xl font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-linear-to-r from-primary to-emerald-500 transition-all duration-1000"
              />
            </div>
          </div>

          {/* Detailed Narrative Items */}
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-medium flex items-center gap-3">
              <RiSuitcaseLine className="size-6 text-primary" />
              Final Narrative Items
            </h3>
            <div className="grid gap-4">
              {booking.items.map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  className="bg-card border border-border/50 rounded-2xl p-5 flex items-start gap-5 hover:border-primary/20 transition-all shadow-xs"
                >
                  <div className="size-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    {item.item_type === "flight" ? <RiPlaneLine className="size-6 text-blue-500" /> :
                     item.item_type === "hotel" ? <RiHotelLine className="size-6 text-primary-500" /> :
                     item.item_type === "car" ? <RiCarLine className="size-6 text-red-500" /> :
                     <RiFileListLine className="size-6 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-lg truncate">{item.title}</h4>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{item.item_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <RiCalendarLine className="size-3" /> 
                        {item.start_date ? formatDate(item.start_date) : "TBD"}
                      </span>
                      {item.is_round_trip && (
                        <Badge className="bg-blue-50 text-blue-700 text-[8px] uppercase border-blue-100">Round Trip</Badge>
                      )}
                      {item.with_driver && (
                        <Badge className="bg-orange-50 text-orange-700 text-[8px] uppercase border-orange-100">With Driver</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-display text-xl font-medium flex items-center gap-2">
                <RiFileListLine className="size-5 text-primary" />
                Concierge Action Items
              </h3>
            </div>
            <div className="divide-y divide-border">
              {booking.needsFlights && (
                <ChecklistItem 
                  checked={checklist.flightTickets} 
                  onChange={() => toggleItem("flightTickets")}
                  title={t("actions.uploadTickets")}
                  subtitle="Verify flight numbers and seats"
                  icon={RiPlaneLine}
                />
              )}
              {booking.needsHotel && (
                <ChecklistItem 
                  checked={checklist.hotelConfirmation} 
                  onChange={() => toggleItem("hotelConfirmation")}
                  title={t("actions.confirmHotel")}
                  subtitle="Confirm room type and late check-in"
                  icon={RiHotelLine}
                />
              )}
              {booking.needsCar && (
                <ChecklistItem 
                  checked={checklist.carVoucher} 
                  onChange={() => toggleItem("carVoucher")}
                  title={t("actions.issueCarVoucher")}
                  subtitle="Check driver availability"
                  icon={RiCarLine}
                />
              )}
              {booking.needsGuide && (
                <ChecklistItem 
                  checked={checklist.guideItinerary} 
                  onChange={() => toggleItem("guideItinerary")}
                  title={t("actions.finalizeItinerary")}
                  subtitle="Finalize specific language requirements"
                  icon={RiFileListLine}
                />
              )}
              <ChecklistItem 
                checked={checklist.finalItinerarySent} 
                onChange={() => toggleItem("finalItinerarySent")}
                title={t("actions.sendDocuments")}
                subtitle="Send welcome pack via email"
                icon={RiMailSendLine}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <AlertDialog>
              <AlertDialogTrigger 
                render={
                  <Button 
                    size="lg" 
                    className="rounded-full px-10 h-16 text-lg font-bold shadow-xl shadow-primary/20"
                    disabled={progress < 100 || booking.status === "completed" || isCompleting}
                  >
                    {isCompleting ? "Processing..." : (
                      <>
                        <RiCheckDoubleLine className="mr-2" />
                        {t("actions.complete")}
                      </>
                    )}
                  </Button>
                }
              />
              <AlertDialogContent className="rounded-[2.5rem] p-10 max-w-lg">
                <AlertDialogHeader className="space-y-4">
                  <div className="size-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                    <RiCheckLine className="size-8" />
                  </div>
                  <div className="text-center space-y-2">
                    <AlertDialogTitle className="font-display text-3xl font-medium">Finalize Journey?</AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      This will mark the entire trip as successfully fulfilled. Ensure all documents have been sent to <strong>{booking.name}</strong>.
                    </AlertDialogDescription>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8 sm:justify-center gap-3">
                  <AlertDialogCancel className="rounded-full px-8 h-12 border-border/50">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleComplete}
                    className="rounded-full px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-200"
                  >
                    Yes, Finalize Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Sidebar: Identity & Payment */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm space-y-8">
            <div className="space-y-6">
              <h3 className="font-display text-xl font-medium flex items-center gap-2">
                <RiUserLine className="size-5 text-primary" />
                Customer Identity
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{t("customer.name")}</p>
                  <p className="font-medium text-base">{booking.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{t("customer.email")}</p>
                  <p className="font-medium truncate">{booking.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{t("customer.phone")}</p>
                  <p className="font-medium">{booking.phone || "-"}</p>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="space-y-6">
              <h3 className="font-display text-xl font-medium flex items-center gap-2">
                <RiInformationLine className="size-5 text-primary" />
                Payment Record
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("payment.total")}</p>
                  <p className="font-display text-2xl font-bold text-primary">
                    {booking.currency} {Number(booking.total_amount).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-border/50">
                  <span className="text-xs text-muted-foreground">{t("payment.date")}</span>
                  <span className="font-medium">
                    {booking.payment_completed_at ? formatDate(booking.payment_completed_at) : formatDate(booking.createdAt)}
                  </span>
                </div>
                <div className="pt-2">
                  <Badge className="w-full justify-center py-1 bg-emerald-50 text-emerald-700 border-emerald-100 uppercase tracking-widest text-[10px] font-bold">
                    <RiCheckLine className="size-3 mr-1" /> Paid in Full
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        bookingId={String(booking.id)}
        amount={Number(booking.total_amount) || 0}
        currency={booking.currency || "USD"}
        guestName={booking.name}
        onRefundSuccess={() => {
          router.refresh();
          router.push("/admin/bookings");
        }}
      />
    </div>
  );
}

function ChecklistItem({ checked, onChange, title, subtitle, icon: Icon }: any) {
  return (
    <label className="flex items-center gap-5 p-5 hover:bg-muted/30 cursor-pointer transition-all group">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer size-6 rounded-lg border-border/50 text-primary focus:ring-primary transition-all cursor-pointer"
        />
        <RiCheckLine className="absolute size-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium transition-all", checked ? "text-muted-foreground line-through" : "text-foreground")}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground/60">{subtitle}</p>
      </div>
      <Icon className={cn("size-5 transition-colors", checked ? "text-primary/30" : "text-muted-foreground/40 group-hover:text-primary/60")} />
    </label>
  );
}
