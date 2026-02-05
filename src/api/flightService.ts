/**
 * Centralized flight data fetching - single source of truth for API layer
 * Uses Amadeus when credentials are configured, otherwise falls back to mock data
 */
import type { FlightOffer } from '@/types/flight'
import type { SearchParams } from '@/types/flight'
import { searchFlights } from './amadeus'
import { generateMockFlights } from './mockData'
import { transformAmadeusToFlightOffer } from './transformers'

const AMADEUS_API_KEY = import.meta.env.VITE_AMADEUS_API_KEY
const AMADEUS_API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET

const hasAmadeusCredentials = Boolean(AMADEUS_API_KEY && AMADEUS_API_SECRET)

export interface SearchResult {
  flights: FlightOffer[]
  error?: string
  source: 'amadeus' | 'mock'
}

export async function fetchFlights(params: SearchParams): Promise<SearchResult> {
  if (hasAmadeusCredentials) {
    try {
      const response = await searchFlights(
        {
          originLocationCode: params.origin.toUpperCase(),
          destinationLocationCode: params.destination.toUpperCase(),
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults ?? 1,
          currencyCode: 'EUR',
        },
        AMADEUS_API_KEY!,
        AMADEUS_API_SECRET!
      )

      const flights = (response.data || []).map((offer) =>
        transformAmadeusToFlightOffer(offer, response.dictionaries)
      )

      return { flights, source: 'amadeus' }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Flight search failed'
      return {
        flights: [],
        error: message,
        source: 'amadeus',
      }
    }
  }

  const flights = generateMockFlights(
    params.origin,
    params.destination,
    params.departureDate,
    params.returnDate
  )

  return { flights, source: 'mock' }
}
