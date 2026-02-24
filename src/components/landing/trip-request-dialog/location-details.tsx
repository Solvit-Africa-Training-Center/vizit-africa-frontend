import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Location Details</h3>
      </div>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="departure" className="text-sm font-medium">
            Departure City
          </Label>
          <Autocomplete
            value={departureQuery}
            onValueChange={handleDepartureChange}
          >
            <AutocompleteInput
              id="departure"
              placeholder="e.g., New York, London, Tokyo"
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
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Pick from suggestions or use browser geolocation.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
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
          <Label className="text-sm font-medium">Destination</Label>
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
