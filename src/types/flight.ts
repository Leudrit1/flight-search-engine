/** Normalized flight offer for display in the app */
export interface FlightOffer {
  id: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  price: number
  currency: string
  airline: string
  airlineCode: string
  stops: number
  duration: string
  durationMinutes: number
  segments: FlightSegment[]
  raw?: unknown
}

export interface FlightSegment {
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  carrierCode: string
  flightNumber: string
  duration: string
  numberOfStops: number
}

export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults?: number
}

export interface FilterState {
  stops: 'all' | 'non-stop' | '1-stop' | '2+'
  priceRange: [number, number]
  airlines: string[]
}
