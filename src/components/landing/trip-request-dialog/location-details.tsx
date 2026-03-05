import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompletePortal,
  AutocompletePositioner,
} from "@/components/ui/autocomplete";

export function LocationDetails({
  departureQuery,
  handleDepartureChange,
  isDepartureSearching,
  departureSuggestions,
  isDepartureLocating,
  handleUseCurrentDepartureLocation,
  departureLocationError,
}: {
  departureQuery: string;
  handleDepartureChange: (value: string) => void;
  isDepartureSearching: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  departureSuggestions: any[];
  isDepartureLocating: boolean;
  handleUseCurrentDepartureLocation: () => void;
  departureLocationError: string | null;
}) {
  const t = useTranslations("PlanTrip.conciergeDialog.sections");
  const tForm = useTranslations("PlanTrip.detailedPlanner.sections.foundation");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{t("location")}</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="departure" className="text-sm font-medium">
            {tForm("origin")}
          </Label>
          <Autocomplete
            value={departureQuery}
            onValueChange={handleDepartureChange}
          >
            <AutocompleteInput
              id="departure"
              placeholder={tForm("originPlaceholder")}
              className="h-11"
            />
            <AutocompletePortal>
              <AutocompletePositioner>
                <AutocompletePopup className="w-(--anchor-width)">
                  <AutocompleteList className="max-h-56 overflow-y-auto">
                    {isDepartureSearching ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : null}

                    {!isDepartureSearching
                      ? departureSuggestions.map((suggestion) => (
                          <AutocompleteItem
                            key={suggestion.id}
                            value={suggestion.name}
                          >
                            {suggestion.name}
                          </AutocompleteItem>
                        ))
                      : null}

                    {!isDepartureSearching &&
                    departureSuggestions.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Type at least 2 letters to search locations.
                      </div>
                    ) : null}
                  </AutocompleteList>
                </AutocompletePopup>
              </AutocompletePositioner>
            </AutocompletePortal>
          </Autocomplete>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
              Pick from suggestions or use browser geolocation.
            </p>
            <Button
              type="button"
              size="xs"
              variant="outline"
              className="w-fit"
              loading={isDepartureLocating}
              onClick={() => void handleUseCurrentDepartureLocation()}
            >
              Use my location
            </Button>
          </div>
          {departureLocationError ? (
            <p className="text-xs text-destructive">
              {departureLocationError}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{tForm("destination")}</Label>
          <Input
            value="Kigali, Rwanda"
            disabled
            className="h-11 bg-muted/50 text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
