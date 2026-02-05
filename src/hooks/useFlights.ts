import { useState, useCallback, useMemo } from 'react'
import type { FlightOffer, SearchParams, FilterState } from '@/types/flight'
import { fetchFlights } from '@/api/flightService'

const DEFAULT_FILTERS: FilterState = {
  stops: 'all',
  priceRange: [0, 2000],
  airlines: [],
}

export function useFlights() {
  const [rawFlights, setRawFlights] = useState<FlightOffer[]>([])
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSearch, setLastSearch] = useState<SearchParams | null>(null)
  const [dataSource, setDataSource] = useState<'amadeus' | 'mock'>('mock')

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true)
    setError(null)
    setLastSearch(params)

    try {
      const result = await fetchFlights(params)
      setRawFlights(result.flights)
      setDataSource(result.source)
      if (result.error) setError(result.error)
      if (result.flights.length > 0) {
        const prices = result.flights.map((f) => f.price)
        setFilters((prev) => ({
          ...prev,
          priceRange: [Math.min(...prices), Math.max(...prices)],
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setRawFlights([])
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }, [])

  const availableAirlines = useMemo(() => {
    const set = new Set<string>()
    rawFlights.forEach((f) => set.add(f.airline))
    return Array.from(set).sort()
  }, [rawFlights])

  const minPrice = useMemo(
    () => (rawFlights.length ? Math.min(...rawFlights.map((f) => f.price)) : 0),
    [rawFlights]
  )
  const maxPrice = useMemo(
    () => (rawFlights.length ? Math.max(...rawFlights.map((f) => f.price)) : 2000),
    [rawFlights]
  )

  const filteredFlights = useMemo(() => {
    return rawFlights.filter((flight) => {
      if (filters.stops !== 'all') {
        if (filters.stops === 'non-stop' && flight.stops !== 0) return false
        if (filters.stops === '1-stop' && flight.stops !== 1) return false
        if (filters.stops === '2+' && flight.stops < 2) return false
      }
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) return false
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false
      return true
    })
  }, [rawFlights, filters])

  return {
    rawFlights,
    filteredFlights,
    filters,
    updateFilters,
    search,
    loading,
    error,
    lastSearch,
    dataSource,
    availableAirlines,
    minPrice,
    maxPrice,
  }
}
