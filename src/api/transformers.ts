/**
 * Transform Amadeus API response to normalized FlightOffer
 */
import type { FlightOffer, FlightSegment } from '@/types/flight'
import type { AmadeusFlightOffer, AmadeusFlightSearchResponse } from './amadeus'

function parseDuration(duration: string): number {
  const match = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const mins = parseInt(match[2] || '0', 10)
  return hours * 60 + mins
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  return date.toTimeString().slice(0, 5)
}

export function transformAmadeusToFlightOffer(
  offer: AmadeusFlightOffer,
  dictionaries?: AmadeusFlightSearchResponse['dictionaries']
): FlightOffer {
  const carriers = dictionaries?.carriers ?? {}
  const firstItinerary = offer.itineraries?.[0]
  const segments: FlightSegment[] = []
  let totalStops = 0
  let totalDurationMinutes = 0

  firstItinerary?.segments?.forEach((seg) => {
    totalStops += seg.numberOfStops ?? 0
    const durMin = parseDuration(seg.duration ?? 'PT0M')
    totalDurationMinutes += durMin
    segments.push({
      departure: seg.departure.iataCode,
      arrival: seg.arrival.iataCode,
      departureTime: formatTime(seg.departure.at),
      arrivalTime: formatTime(seg.arrival.at),
      carrierCode: seg.carrierCode,
      flightNumber: seg.number,
      duration: seg.duration ?? 'PT0M',
      numberOfStops: seg.numberOfStops ?? 0,
    })
  })

  const airlineCode = offer.validatingAirlineCodes?.[0] ?? segments[0]?.carrierCode ?? 'XX'
  const airline = carriers[airlineCode] ?? airlineCode

  let durationFormatted = firstItinerary?.duration ?? 'PT0M'
  if (totalDurationMinutes > 0) {
    const h = Math.floor(totalDurationMinutes / 60)
    const m = totalDurationMinutes % 60
    durationFormatted = `PT${h}H${m}M`
  }

  const firstSegment = firstItinerary?.segments?.[0]
  const depDate = firstSegment?.departure?.at
    ? new Date(firstSegment.departure.at).toISOString().slice(0, 10)
    : ''

  return {
    id: offer.id,
    origin: segments[0]?.departure ?? '',
    destination: segments[segments.length - 1]?.arrival ?? '',
    departureDate: depDate,
    returnDate: undefined,
    price: parseFloat(offer.price?.total ?? '0'),
    currency: offer.price?.currency ?? 'EUR',
    airline,
    airlineCode,
    stops: totalStops,
    duration: durationFormatted,
    durationMinutes: totalDurationMinutes,
    segments,
    raw: offer,
  }
}
