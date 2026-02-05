/**
 * Amadeus Self-Service API - Flight Offers Search
 * https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search
 */

const BASE_URL = 'https://test.api.amadeus.com'

export interface AmadeusFlightOffer {
  type: string
  id: string
  source: string
  instantTicketingRequired?: boolean
  nonHomogeneous?: boolean
  oneWay?: boolean
  lastTicketingDate?: string
  numberOfBookableSeats?: number
  itineraries: Array<{
    duration?: string
    segments: Array<{
      departure: { iataCode: string; terminal?: string; at: string }
      arrival: { iataCode: string; terminal?: string; at: string }
      carrierCode: string
      number: string
      aircraft?: { code: string }
      operating?: { carrierCode: string }
      duration?: string
      id: string
      numberOfStops: number
      blacklistedInEU?: boolean
    }>
  }>
  price: {
    currency: string
    total: string
    base?: string
    grandTotal?: string
    fees?: Array<{ amount: string; type: string }>
  }
  pricingOptions?: Record<string, unknown>
  validatingAirlineCodes: string[]
  travelerPricings?: unknown[]
}

export interface AmadeusFlightSearchResponse {
  meta?: { count?: number }
  data: AmadeusFlightOffer[]
  dictionaries?: {
    locations?: Record<string, { cityCode?: string; countryCode?: string }>
    aircraft?: Record<string, string>
    currencies?: Record<string, string>
    carriers?: Record<string, string>
  }
}

async function getAccessToken(apiKey: string, apiSecret: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Amadeus auth failed: ${response.status} ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

export interface FlightSearchParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate: string
  returnDate?: string
  adults?: number
  nonStop?: boolean
  maxPrice?: number
  currencyCode?: string
  includedAirlineCodes?: string
}

export async function searchFlights(
  params: FlightSearchParams,
  apiKey: string,
  apiSecret: string
): Promise<AmadeusFlightSearchResponse> {
  const token = await getAccessToken(apiKey, apiSecret)

  const searchParams = new URLSearchParams({
    originLocationCode: params.originLocationCode.toUpperCase(),
    destinationLocationCode: params.destinationLocationCode.toUpperCase(),
    departureDate: params.departureDate,
    adults: String(params.adults ?? 1),
  })

  if (params.returnDate) searchParams.set('returnDate', params.returnDate)
  if (params.nonStop !== undefined) searchParams.set('nonStop', String(params.nonStop))
  if (params.maxPrice) searchParams.set('maxPrice', String(params.maxPrice))
  if (params.currencyCode) searchParams.set('currencyCode', params.currencyCode)
  if (params.includedAirlineCodes) searchParams.set('includedAirlineCodes', params.includedAirlineCodes)

  const url = `${BASE_URL}/v2/shopping/flight-offers?${searchParams}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Amadeus flight search failed: ${response.status} ${error}`)
  }

  return response.json()
}
