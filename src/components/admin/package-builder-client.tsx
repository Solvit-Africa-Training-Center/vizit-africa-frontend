"use client";

import { RequestDetails } from "./package-builder/request-details";
import { GroupedItems } from "./package-builder/grouped-items";
import { AddDialog } from "./package-builder/add-dialog";
import { ValidationAlertBanner } from "./package-builder/validation-alert-banner";
import { QuoteSummaryPanel } from "./package-builder/quote-summary-panel";
import { QuotePreviewModal } from "./package-builder/quote=preview-modal";
import { BuilderHeader } from "./package-builder/builder-header";
import { type Booking } from "@/lib/unified-types";
import { usePackageBuilder } from "@/hooks/use-package-builder";
import {
  SERVICE_GROUPS as GROUPS,
  type ServiceGroupKey as GroupKey,
} from "@/lib/utils";

const MUTABLE_GROUPS = [...GROUPS] as const;

interface PackageBuilderClientProps {
  request: Booking;
}

export function PackageBuilderClient({ request }: PackageBuilderClientProps) {
  const {
    displayItems,
    isSending,
    notifying,
    isAddDialogOpen,
    setIsAddDialogOpen,
    activeGroup,
    newItem,
    setNewItem,
    services,
    selectedServiceId,
    showPreviewModal,
    setShowPreviewModal,
    grouped,
    total,
    validation,
    handleAddItem,
    openAddDialog,
    handleServiceSelect,
    handleSendQuote,
    handleNotifyVendor,
    updateItem,
    removeItem,
    clearDraft,
    quoteBreakdown,
  } = usePackageBuilder(request);

  return (
    <div className="mx-auto max-w-9xl px-5 md:px-10 py-8 min-h-screen pb-24">
      <BuilderHeader
        requestName={request.name}
        total={total}
        isSending={isSending}
        itemCount={displayItems.length}
        onClearDraft={clearDraft}
        onSendQuote={handleSendQuote}
      />

      <ValidationAlertBanner validation={validation} />

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 order-1">
          <RequestDetails request={request} />
        </div>

        <div className="lg:col-span-2 space-y-8 order-2">
          <GroupedItems
            grouped={grouped}
            GROUPS={Array.from(MUTABLE_GROUPS) as GroupKey[]}
            openAddDialog={openAddDialog}
            removeItem={removeItem}
            updateItem={updateItem}
            handleNotifyVendor={handleNotifyVendor}
            notifying={notifying}
            requestDefaults={{
              startDate: request.arrivalDate || undefined,
              endDate: request.departureDate || undefined,
            }}
          />
        </div>

        <div className="lg:col-span-1 order-3">
          <QuoteSummaryPanel
            itemCount={displayItems.length}
            breakdown={quoteBreakdown}
            onPreview={() => setShowPreviewModal(true)}
            isLoading={isSending}
            isDisabled={
              validation.errors.length > 0 || displayItems.length === 0
            }
          />
        </div>
      </div>

      <AddDialog
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        activeGroup={activeGroup}
        newItem={newItem}
        setNewItem={setNewItem}
        services={services}
        selectedServiceId={selectedServiceId}
        handleServiceSelect={handleServiceSelect}
        handleAddItem={handleAddItem}
      />

      <QuotePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={async () => {
          setShowPreviewModal(false);
          await handleSendQuote();
        }}
        items={displayItems}
        breakdown={quoteBreakdown}
        travelerName={request.name}
        clientEmail={request.email}
        warnings={validation.warnings}
        isLoading={isSending}
      />
    </div>
  );
}
