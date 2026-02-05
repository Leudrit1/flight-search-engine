import type { FlightOffer } from '@/types/flight'
import type { SearchParams } from '@/types/flight'
import { searchFlights } from './amadeus'
import { transformAmadeusToFlightOffer } from './transformers'

const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID
const clientCredential = import.meta.env.VITE_AMADEUS_CLIENT_CREDENTIAL

const hasAmadeusCredentials = Boolean(clientId && clientCredential)

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
        clientId!,
        clientCredential!
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

  return {
    flights: [],
    error: 'Live flight API is not configured for this environment.',
    source: 'mock',
  }
}
