"use client";

import { useState } from "react";
import { getVendorDashboardStats, getVendorRequests } from "@/actions/vendors";
import { Button } from "@/components/ui/button";
import { RiPlayLine, RiCheckLine, RiCloseLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export default function VendorApiTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const testResults = [];

    // Test 1: getVendorDashboardStats
    try {
      const stats = await getVendorDashboardStats();
      testResults.push({
        name: "getVendorDashboardStats",
        success: stats.success,
        data: stats.success ? stats.data : stats.error,
      });
    } catch (e: any) {
      testResults.push({ name: "getVendorDashboardStats", success: false, data: e.message });
    }

    // Test 2: getVendorRequests
    try {
      const requests = await getVendorRequests();
      testResults.push({
        name: "getVendorRequests",
        success: requests.success,
        data: requests.success ? `${requests.data.length} requests found` : requests.error,
      });
    } catch (e: any) {
      testResults.push({ name: "getVendorRequests", success: false, data: e.message });
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="container py-20 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold uppercase tracking-tight">Vendor API Integrity Test</h1>
        <Button onClick={runTests} disabled={loading} className="rounded-full px-8">
          {loading ? "Running..." : "Run All Tests"}
          <RiPlayLine className="ml-2 size-4" />
        </Button>
      </div>

      <div className="grid gap-6">
        {results.map((res, i) => (
          <div key={i} className={cn("p-6 border rounded-2xl", res.success ? "border-emerald-500/20 bg-emerald-500/5" : "border-destructive/20 bg-destructive/5")}>
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="text-lg font-mono font-bold">{res.name}</h3>
              {res.success ? <RiCheckLine className="text-emerald-500" /> : <RiCloseLine className="text-destructive" />}
            </div>
            <div>
              <pre className="text-xs overflow-auto p-4 bg-black/5 rounded-lg max-h-40">
                {JSON.stringify(res.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}
        
        {results.length === 0 && !loading && (
          <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-3xl">
            Click "Run All Tests" to verify vendor endpoints.
          </div>
        )}
      </div>
    </div>
  );
}
