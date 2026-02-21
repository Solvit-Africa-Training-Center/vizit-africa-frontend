import { RiTimeLine, RiInboxLine, RiCalendarCheckLine, RiMoneyDollarCircleLine } from "@remixicon/react";
import { getCurrentUser } from "@/actions/auth";
import { getVendorDashboardStats, getVendorRequests } from "@/actions/vendors";
import { CompletedRequestsSchedule } from "@/components/schedule";
import { VendorRequestsList } from "@/components/vendor/vendor-requests-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, redirect } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function VendorDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
      <div className="container py-20">
        <Alert>
          <AlertTitle>Incomplete Profile</AlertTitle>
          <AlertDescription>
            It seems you are registered as a vendor but haven't completed your
            business profile.
          </AlertDescription>
        </Alert>
        <Link 
          href="/partners/apply" 
          className={cn(buttonVariants(), "mt-4")}
        >
          Complete Profile
        </Link>
      </div>
    );
  }

  if (!vendorProfile.is_approved) {
    return (
      <div className="container max-w-2xl py-20">
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
          <div className="mx-auto bg-amber-100 text-amber-600 h-16 w-16 rounded-full flex items-center justify-center mb-6">
            <RiTimeLine className="size-8" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4">
            Application Under Review
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for applying to become a partner with Vizit Africa. Your
            application for{" "}
            <span className="font-semibold text-foreground">
              {vendorProfile.business_name}
            </span>{" "}
            is currently being reviewed by our team.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
            We typically review applications within 24-48 hours. You will
            receive an email once your account is approved.
          </div>
          <Link 
            href="/" 
            className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
          >
            Back to Home
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

  const stats = statsResult.success
    ? statsResult.data
    : { active_requests: 0, upcoming_bookings: 0, total_revenue: 0 };
  const requests = requestsResult.success ? requestsResult.data : [];

  return (
    <div className="container py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {vendorProfile.business_name}
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/" 
            className={buttonVariants({ variant: "outline" })}
          >
            Public Site
          </Link>
          <Link 
            href="/profile" 
            className={buttonVariants({ variant: "outline" })}
          >
            My Profile
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
          <div className="size-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <RiInboxLine className="size-6" />
          </div>
          <div>
            <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold">{stats.active_requests}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
          <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <RiCalendarCheckLine className="size-6" />
          </div>
          <div>
            <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
              Upcoming Bookings
            </h3>
            <p className="text-3xl font-bold">{stats.upcoming_bookings}</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5">
          <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <RiMoneyDollarCircleLine className="size-6" />
          </div>
          <div>
            <h3 className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold">
              ${stats.total_revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-medium">New Opportunities</h2>
            <Badge variant="secondary">{requests.length} Requests</Badge>
          </div>
          <VendorRequestsList requests={requests} />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-display font-medium">Schedule</h2>
          <CompletedRequestsSchedule
            bookings={[]}
            emptyMessage="No upcoming services scheduled yet."
          />
        </div>
      </div>
    </div>
  );
}
