/**
 * Mock flight data for development/demo when Amadeus API is not configured
 * Uses realistic structure matching Amadeus Flight Offers Search response
 */
import type { FlightOffer } from '@/types/flight'

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || '0', 10)
  const mins = parseInt(match[2] || '0', 10)
  return hours * 60 + mins
}

export function generateMockFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  count = 50
): FlightOffer[] {
  const airlines = [
    { code: 'UA', name: 'United Airlines' },
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'BA', name: 'British Airways' },
    { code: 'AF', name: 'Air France' },
    { code: 'KL', name: 'KLM' },
    { code: 'LX', name: 'Swiss International' },
    { code: 'OS', name: 'Austrian Airlines' },
    { code: 'IB', name: 'Iberia' },
    { code: 'AZ', name: 'ITA Airways' },
  ]

  const stopOptions = [
    { stops: 0, duration: 'PT2H30M' },
    { stops: 0, duration: 'PT3H15M' },
    { stops: 1, duration: 'PT5H45M' },
    { stops: 1, duration: 'PT6H20M' },
    { stops: 2, duration: 'PT9H30M' },
  ]

  const flights: FlightOffer[] = []
  const basePrice = 80 + Math.random() * 400

  for (let i = 0; i < count; i++) {
    const airline = airlines[i % airlines.length]
    const stopOption = stopOptions[i % stopOptions.length]
    const price = Math.round((basePrice + i * 12 + Math.random() * 80) * 100) / 100
    const durationMinutes = parseDuration(stopOption.duration) + stopOption.stops * 90

    flights.push({
      id: `mock-${origin}-${destination}-${i}-${Date.now()}`,
      origin,
      destination,
      departureDate,
      returnDate,
      price,
      currency: 'EUR',
      airline: airline.name,
      airlineCode: airline.code,
      stops: stopOption.stops,
      duration: stopOption.duration,
      durationMinutes,
      segments: [
        {
          departure: origin,
          arrival: destination,
          departureTime: '08:00',
          arrivalTime: '11:30',
          carrierCode: airline.code,
          flightNumber: `${100 + i}`,
          duration: stopOption.duration,
          numberOfStops: stopOption.stops,
        },
      ],
    })
  }

  return flights.sort((a, b) => a.price - b.price)
}
