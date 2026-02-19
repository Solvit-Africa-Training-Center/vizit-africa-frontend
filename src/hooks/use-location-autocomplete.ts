import { useCallback, useEffect, useState } from "react";
import {
  getBrowserCoordinates,
  type LocationSuggestion,
  reverseGeocodeWithNominatim,
  searchLocationsWithNominatim,
} from "@/lib/location/nominatim";

interface UseLocationAutocompleteOptions {
  initialQuery?: string;
  minQueryLength?: number;
  debounceMs?: number;
  limit?: number;
  countryCodes?: string;
  enabled?: boolean;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}

export function useLocationAutocomplete(
  options: UseLocationAutocompleteOptions = {},
) {
  const {
    initialQuery = "",
    minQueryLength = 2,
    debounceMs = 350,
    limit = 5,
    countryCodes,
    enabled = true,
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const normalizedQuery = query.trim();
    if (normalizedQuery.length < minQueryLength) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setError(null);
        const results = await searchLocationsWithNominatim(normalizedQuery, {
          signal: controller.signal,
          limit,
          countryCodes,
        });
        setSuggestions(results);
      } catch (nextError) {
        if (
          nextError instanceof DOMException &&
          nextError.name === "AbortError"
        ) {
          return;
        }

        setSuggestions([]);
        setError(
          getErrorMessage(nextError, "Unable to search locations right now."),
        );
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, minQueryLength, debounceMs, limit, countryCodes, enabled]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setError(null);
  }, []);

  const selectSuggestion = useCallback((suggestion: LocationSuggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    setError(null);
  }, []);

  const detectCurrentLocation = useCallback(async () => {
    try {
      setIsLocating(true);
      setError(null);

      const position = await getBrowserCoordinates();
      const suggestion = await reverseGeocodeWithNominatim(
        position.coords.latitude,
        position.coords.longitude,
      );

      if (!suggestion) {
        throw new Error("Unable to determine your current location.");
      }

      selectSuggestion(suggestion);
      return suggestion;
    } catch (nextError) {
      setError(
        getErrorMessage(
          nextError,
          "Unable to access your location. Check browser permissions.",
        ),
      );
      return null;
    } finally {
      setIsLocating(false);
    }
  }, [selectSuggestion]);

  return {
    query,
    setQuery,
    suggestions,
    isSearching,
    isLocating,
    error,
    clear,
    clearSuggestions,
    selectSuggestion,
    detectCurrentLocation,
  };
}

export type { LocationSuggestion };
