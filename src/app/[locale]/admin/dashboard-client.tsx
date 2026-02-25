"use client";

import {
  RiCheckLine,
  RiDashboardLine,
  RiFileListLine,
  RiMailLine,
  RiTimeLine,
} from "@remixicon/react";
import { useTranslations } from "next-intl";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Link } from "@/i18n/navigation";
import type { Booking } from "@/lib/unified-types";

interface DashboardClientProps {
  requests: Booking[];
}

export default function DashboardClient({ requests }: DashboardClientProps) {
  const t = useTranslations("Admin.dashboard");

  const pendingCount = requests.filter(
    (request) => request.status === "pending",
  ).length;
  const quotedCount = requests.filter(
    (request) => request.status === "quoted",
  ).length;
  const paidCount = requests.filter(
    (request) => request.status === "paid",
  ).length;

  const stats = [
    {
      label: t("stats.pending"),
      value: pendingCount,
      icon: RiTimeLine,
      color: "text-accent-warm",
    },
    {
      label: t("stats.quoted"),
      value: quotedCount,
      icon: RiMailLine,
      color: "text-primary",
    },
    {
      label: t("stats.paid"),
      value: paidCount,
      icon: RiCheckLine,
      color: "text-accent-success",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-5"
          >
            <div className="flex items-center gap-4">
              <div
                className={`size-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="font-mono text-2xl font-medium text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
        >
          <RiDashboardLine className="size-4" />
          {t("overview")}
        </Link>
        <Link
          href="/admin/requests"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted text-sm font-medium transition-colors"
        >
          <RiFileListLine className="size-4" />
          {t("requests")}
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">
            {t("recentRequests.title")}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {requests.length === 0 ? (
            <Empty className="border-none">
              <EmptyMedia variant="icon">
                <RiFileListLine className="size-6 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No recent requests</EmptyTitle>
              <EmptyDescription>No recent requests found.</EmptyDescription>
            </Empty>
          ) : (
            requests.slice(0, 10).map((request) => (
              <div
                key={request.id}
                className="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {request.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {request.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.travelers} {t("recentRequests.travelers")} -{" "}
                      {request.arrivalDate} {t("recentRequests.to")}{" "}
                      {request.departureDate || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      request.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : request.status === "quoted"
                          ? "bg-blue-100 text-blue-700"
                          : request.status === "accepted"
                            ? "bg-indigo-100 text-indigo-700"
                            : request.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {request.status}
                  </span>
                  <Link
                    href={`/admin/packages/${request.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {request.status === "pending"
                      ? t("recentRequests.createPackage")
                      : t("recentRequests.viewPackage")}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
