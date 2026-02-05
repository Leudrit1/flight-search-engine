import { useState, useEffect } from 'react'
import { Box, Container, Typography, Paper, useTheme, useMediaQuery, Alert, Stack } from '@mui/material'
import { FlightSearchForm } from '@/components/FlightSearchForm/FlightSearchForm'
import { FiltersPanel } from '@/components/FiltersPanel/FiltersPanel'
import { FlightDataGrid } from '@/components/FlightDataGrid/FlightDataGrid'
import { PriceChart } from '@/components/PriceChart/PriceChart'
import { EmptyState } from '@/components/EmptyState/EmptyState'
import { FlightGridSkeleton, ChartSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton'
import { FiltersDrawer } from '@/components/FiltersDrawer/FiltersDrawer'
import { useFlights } from '@/hooks/useFlights'
import type { SearchParams } from '@/types/flight'

function App() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false)

  const {
    filteredFlights,
    filters,
    updateFilters,
    search,
    loading,
    error,
    lastSearch,
    availableAirlines,
    minPrice,
    maxPrice,
  } = useFlights()

  const [recentSearches, setRecentSearches] = useState<SearchParams[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('flight_recent_searches')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed)
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, [])

  const handleSearch = (params: SearchParams) => {
    setRecentSearches((prev) => {
      const normalized: SearchParams = {
        ...params,
        origin: params.origin.toUpperCase(),
        destination: params.destination.toUpperCase(),
      }

      const withoutDuplicate = prev.filter(
        (item) =>
          !(
            item.origin === normalized.origin &&
            item.destination === normalized.destination &&
            item.departureDate === normalized.departureDate &&
            (item.returnDate || '') === (normalized.returnDate || '') &&
            (item.adults ?? 1) === (normalized.adults ?? 1)
          )
      )

      const next = [normalized, ...withoutDuplicate].slice(0, 5)

      try {
        localStorage.setItem('flight_recent_searches', JSON.stringify(next))
      } catch {
        // ignore storage errors
      }

      return next
    })

    search(params)
  }

  const hasSearched = Boolean(lastSearch)
  const hasResults = filteredFlights.length > 0

  const filtersContent = (
    <FiltersPanel
      filters={filters}
      onFiltersChange={updateFilters}
      availableAirlines={availableAirlines}
      minPrice={minPrice}
      maxPrice={maxPrice}
      resultCount={filteredFlights.length}
    />
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Flight Search Engine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search flights and compare prices. Use the filters to refine results—the list and price chart update in real time.
            </Typography>
          </Box>

          <FlightSearchForm
            onSearch={handleSearch}
            loading={loading}
            lastSearch={lastSearch}
            recentSearches={recentSearches}
            onRecentSearchSelect={handleSearch}
          />

          {error && (
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          )}

          {hasSearched && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              {/* Filters - sidebar on desktop, drawer on mobile */}
              {isDesktop ? (
                <Paper
                  sx={{
                    p: 2,
                    width: 240,
                    flexShrink: 0,
                  }}
                >
                  {filtersContent}
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiltersDrawer
                    open={filtersDrawerOpen}
                    onClose={() => setFiltersDrawerOpen(false)}
                    onOpen={() => setFiltersDrawerOpen(true)}
                  >
                    {filtersContent}
                  </FiltersDrawer>
                  <Typography variant="body2" color="text.secondary">
                    {filteredFlights.length} flights
                  </Typography>
                </Box>
              )}

              {/* Main content */}
              <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
                {loading ? (
                  <Stack spacing={2}>
                    <ChartSkeleton />
                    <FlightGridSkeleton />
                  </Stack>
                ) : !hasResults ? (
                  <Paper sx={{ minHeight: 400 }}>
                    <EmptyState
                      title={lastSearch ? 'No flights match your criteria' : 'Search for flights'}
                      description={
                        lastSearch
                          ? 'Try adjusting your filters or search different dates.'
                          : 'Enter origin, destination, and dates to find flights.'
                      }
                    />
                  </Paper>
                ) : (
                  <Stack spacing={2}>
                    <PriceChart flights={filteredFlights} />
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                        Results ({filteredFlights.length})
                      </Typography>
                      <FlightDataGrid flights={filteredFlights} />
                    </Paper>
                  </Stack>
                )}
              </Box>
            </Box>
          )}

          {!hasSearched && (
            <Paper sx={{ minHeight: 400 }}>
              <EmptyState
                title="Ready to search"
                description="Enter origin, destination, and dates above. Use the quick route buttons or type IATA airport codes (e.g. MAD, BCN, LHR)."
              />
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default App
