import {
  RiTimeLine,
  RiInboxLine,
  RiCalendarCheckLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { getVendorDashboardStats, getVendorRequests } from "@/actions/vendors";
import { CompletedRequestsSchedule } from "@/components/schedule/completed-requests-schedule";
import { VendorRequestsList } from "@/components/vendor/vendor-requests-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, redirect } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function VendorDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Vendor.dashboard");
  const userResult = await getCurrentUser();

  const user = userResult.success ? userResult.data : null;
  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }
  const isVendor = user.role === "VENDOR";

  if (!isVendor) {
    redirect({ href: "/partners/apply", locale });
    return null;
  }

  const vendorProfile = user.vendor_profile;

  if (!vendorProfile) {
    return (
      <div className="marketing-container py-20">
        <Alert>
          <AlertTitle>{t("incomplete.title")}</AlertTitle>
          <AlertDescription>
            {t("incomplete.description")}
          </AlertDescription>
        </Alert>
        <Link href="/partners/apply" className={cn(buttonVariants(), "mt-4 rounded-full font-display uppercase tracking-widest text-[10px] font-bold h-12 px-8")}>
          {t("incomplete.cta")}
        </Link>
      </div>
    );
  }

  if (!vendorProfile.isApproved) {
    return (
      <div className="marketing-container max-w-2xl py-20">
        <div className="bg-card border border-border/50 rounded-[2rem] p-12 text-center shadow-card">
          <div className="mx-auto bg-primary-500/10 text-primary-600 h-20 w-20 rounded-2xl flex items-center justify-center mb-8 border border-primary-500/20">
            <RiTimeLine className="size-10" />
          </div>
          <h1 className="text-3xl font-display font-medium uppercase tracking-tight mb-4">
            {t("review.title")}
          </h1>
          <p className="text-muted-foreground mb-10 font-light leading-relaxed text-pretty">
            {t.rich("review.description", {
              businessName: () => (
                <span className="font-semibold text-foreground">
                  {vendorProfile.businessName}
                </span>
              ),
            })}
          </p>
          <div className="bg-muted/30 p-6 rounded-2xl text-sm text-muted-foreground border border-border/50 italic">
            {t("review.notice")}
          </div>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }), "mt-10 rounded-full font-display uppercase tracking-widest text-[10px] font-bold h-12 px-8")}
          >
            {t("review.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  // Fetch real data
  const [statsResult, requestsResult] = await Promise.all([
    getVendorDashboardStats(),
    getVendorRequests(),
  ]);

  interface VendorStats {
    active_requests: number;
    upcoming_bookings: number;
    total_revenue: number;
  }

  const stats = (statsResult.success
    ? statsResult.data
    : { active_requests: 0, upcoming_bookings: 0, total_revenue: 0 }) as unknown as VendorStats;
  const requests = requestsResult.success ? requestsResult.data : [];

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <div className="marketing-container space-y-12 pb-24">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/50 pb-12">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary font-bold mb-4 block">
              {t("overline")}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tighter leading-[0.9]">
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-6 text-lg font-light text-pretty">
              {t("welcome", { businessName: vendorProfile.businessName })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className={cn(
                "h-12 px-6 rounded-full border border-border/50 flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.2em] font-bold hover:bg-muted transition-all duration-300"
              )}
            >
              {t("actions.publicSite")}
            </Link>
            <Link
              href="/profile"
              className={cn(
                "h-12 px-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-mono uppercase tracking-[0.2em] font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-500"
              )}
            >
              {t("actions.myProfile")}
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={RiInboxLine} 
            label={t("stats.pendingRequests")} 
            value={stats.active_requests} 
            color="amber"
          />
          <StatCard 
            icon={RiCalendarCheckLine} 
            label={t("stats.upcomingBookings")} 
            value={stats.upcoming_bookings} 
            color="emerald"
          />
          <StatCard 
            icon={RiMoneyDollarCircleLine} 
            label={t("stats.totalRevenue")} 
            value={`$${stats.total_revenue.toLocaleString()}`} 
            color="primary"
          />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 pt-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
              <h2 className="text-2xl font-display font-medium uppercase tracking-tight">
                {t("opportunities.title")}
              </h2>
              <Badge variant="outline" className="rounded-full px-3 py-1 font-mono text-[10px] uppercase font-bold tracking-widest">
                {t("opportunities.total", { count: requests.length })}
              </Badge>
            </div>
            <VendorRequestsList requests={requests} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-display font-medium uppercase tracking-tight text-muted-foreground/40">
                {t("schedule.title")}
              </h2>
            </div>
            <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 min-h-[400px]">
              <CompletedRequestsSchedule
                bookings={[]}
                emptyMessage={t("schedule.empty")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any, 
  label: string, 
  value: string | number, 
  color: "amber" | "emerald" | "primary" 
}) {
  const colors = {
    amber: "bg-primary-500/10 text-primary-600 border-primary-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    primary: "bg-primary/5 text-primary border-primary/10",
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-card flex items-center gap-6 group hover:border-primary/30 transition-all duration-500">
      <div className={cn("size-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 border", colors[color])}>
        <Icon className="size-8" />
      </div>
      <div>
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
          {label}
        </h3>
        <p className="text-4xl font-display font-medium tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}
