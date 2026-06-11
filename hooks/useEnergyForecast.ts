"use client";

import { useQuery } from "@apollo/client/react";
import { GET_ENERGY_FORECAST } from "@/graphql/queries";
import type { ZoneId } from "@/types";

export function useEnergyForecast(zone: ZoneId) {
  const { data, loading, error } = useQuery(GET_ENERGY_FORECAST, {
    variables: { zone },
  });
  return { forecast: data?.energyForecast ?? null, loading, error };
}
