import { getCurrentUser } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RiTimeLine } from "@remixicon/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VendorDashboardPage() {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.data) {
    redirect("/login");
  }

  const user = userResult.data;
  const isVendor = user.role === "VENDOR";

  // If not a vendor, redirect to home or apply
  if (!isVendor) {
    redirect("/partners/apply");
  }

  const vendorProfile = user.vendor_profile;

  // If vendor but no profile (shouldn't happen with our flow but possible), redirect to apply
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
        <Button render={<Link href="/partners/apply" />} className="mt-4">
          Complete Profile
        </Button>
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
          <Button variant="outline" render={<Link href="/" />} className="mt-8">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Approved Vendor Dashboard
  // Ideally this would show stats, recent bookings, etc.
  // For now, we reuse components or show a placeholder dashboard.
  // We can redirect to the inventory page or show the inventory here.

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Vendor Dashboard</h1>
        <Button render={<Link href="/admin/inventory" />}>
          Manage Inventory
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-muted-foreground font-medium mb-2">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-muted-foreground font-medium mb-2">
            Active Services
          </h3>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-muted-foreground font-medium mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
      </div>

      <div className="mt-10 p-10 text-center border border-dashed rounded-xl">
        <p className="text-muted-foreground">
          Recent activity will appear here.
        </p>
      </div>
    </div>
  );
}
