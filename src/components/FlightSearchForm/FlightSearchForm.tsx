import { useState } from 'react'
import { Box, Button, TextField, Paper, Grid, InputAdornment, MenuItem } from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SearchIcon from '@mui/icons-material/Search'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import type { SearchParams } from '@/types/flight'

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void
  loading?: boolean
  lastSearch?: SearchParams | null
  recentSearches?: SearchParams[]
  onRecentSearchSelect?: (params: SearchParams) => void
}

const COMMON_ROUTES: [string, string][] = [
  ['MAD', 'BCN'],
  ['CDG', 'LHR'],
  ['AMS', 'FRA'],
  ['FCO', 'MUC'],
  ['LIS', 'MAD'],
  ['VIE', 'AMS'],
  ['ATH', 'FCO'],
]

export function FlightSearchForm({
  onSearch,
  loading = false,
  lastSearch,
  recentSearches = [],
  onRecentSearchSelect,
}: FlightSearchFormProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const [origin, setOrigin] = useState(lastSearch?.origin ?? 'MAD')
  const [destination, setDestination] = useState(lastSearch?.destination ?? 'BCN')
  const [departureDate, setDepartureDate] = useState(
    lastSearch?.departureDate ?? tomorrow.toISOString().slice(0, 10)
  )
  const [returnDate, setReturnDate] = useState(
    lastSearch?.returnDate ?? nextWeek.toISOString().slice(0, 10)
  )
  const [adults, setAdults] = useState(lastSearch?.adults ?? 1)

  const handleSwap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({
      origin: origin.toUpperCase().trim(),
      destination: destination.toUpperCase().trim(),
      departureDate,
      returnDate,
      adults,
    })
  }

  const handleRecentClick = (search: SearchParams) => {
    setOrigin(search.origin)
    setDestination(search.destination)
    setDepartureDate(search.departureDate)
    setReturnDate(search.returnDate ?? '')
    setAdults(search.adults ?? 1)

    if (typeof onRecentSearchSelect === 'function') {
      onRecentSearchSelect(search)
    } else {
      onSearch({
        origin: search.origin,
        destination: search.destination,
        departureDate: search.departureDate,
        returnDate: search.returnDate,
        adults: search.adults ?? 1,
      })
    }
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              placeholder="e.g. MAD"
              inputProps={{ maxLength: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightTakeoffIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSwap}
                sx={{ minWidth: 40 }}
                aria-label="Swap origin and destination"
              >
                <SwapHorizIcon />
              </Button>
              <TextField
                fullWidth
                label="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                placeholder="e.g. BCN"
                inputProps={{ maxLength: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FlightLandIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Departure"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().slice(0, 10) }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Return"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: departureDate }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <TextField
              fullWidth
              select
              label="Adults"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              SelectProps={{ native: false }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !origin || !destination || !departureDate}
              startIcon={<SearchIcon />}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Searching…' : 'Search'}
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {COMMON_ROUTES.map(([from, to]) => (
              <Button
                key={`${from}-${to}`}
                size="small"
                variant={origin === from && destination === to ? 'contained' : 'outlined'}
                onClick={() => {
                  setOrigin(from)
                  setDestination(to)
                }}
              >
                {from} → {to}
              </Button>
            ))}
          </Box>
          {recentSearches.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {recentSearches.slice(0, 3).map((search: SearchParams, index: number) => (
                <Button
                  key={index}
                  size="small"
                  variant="outlined"
                  onClick={() => handleRecentClick(search)}
                >
                  {search.origin} → {search.destination} · {search.departureDate}
                  {search.returnDate ? ` → ${search.returnDate}` : ''}
                  {search.adults && search.adults > 0
                    ? ` · ${search.adults} adult${search.adults > 1 ? 's' : ''}`
                    : ''}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </form>
    </Paper>
  )
}
