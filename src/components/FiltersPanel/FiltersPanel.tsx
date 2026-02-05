import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Chip,
  Stack,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import type { FilterState } from '@/types/flight'

interface FiltersPanelProps {
  filters: FilterState
  onFiltersChange: (updates: Partial<FilterState>) => void
  availableAirlines: string[]
  minPrice: number
  maxPrice: number
  resultCount: number
}

const STOPS_OPTIONS: { value: FilterState['stops']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'non-stop', label: 'Non-stop' },
  { value: '1-stop', label: '1 stop' },
  { value: '2+', label: '2+ stops' },
]

export function FiltersPanel({
  filters,
  onFiltersChange,
  availableAirlines,
  minPrice,
  maxPrice,
  resultCount,
}: FiltersPanelProps) {
  const handleStopsChange = (value: FilterState['stops']) => {
    onFiltersChange({ stops: value })
  }

  const handlePriceChange = (_: Event, value: number | number[]) => {
    const [min, max] = value as [number, number]
    onFiltersChange({ priceRange: [min, max] })
  }

  const handleAirlineToggle = (airline: string) => {
    const next = filters.airlines.includes(airline)
      ? filters.airlines.filter((a) => a !== airline)
      : [...filters.airlines, airline]
    onFiltersChange({ airlines: next })
  }

  const handleClearAll = () => {
    onFiltersChange({
      stops: 'all',
      priceRange: [minPrice, maxPrice],
      airlines: [],
    })
  }

  const hasActiveFilters =
    filters.stops !== 'all' ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice ||
    filters.airlines.length > 0

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FilterListIcon fontSize="small" />
          Filters
        </Typography>
        {hasActiveFilters && (
          <Chip
            label="Clear all"
            size="small"
            onClick={handleClearAll}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          Stops
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {STOPS_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              size="small"
              variant={filters.stops === opt.value ? 'filled' : 'outlined'}
              onClick={() => handleStopsChange(opt.value)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          Price range
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `€${v}`}
            min={minPrice}
            max={maxPrice}
            step={5}
            sx={{ mt: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary">
            €{filters.priceRange[0]} – €{filters.priceRange[1]}
          </Typography>
        </Box>
      </Box>

      {availableAirlines.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Airlines
          </Typography>
          <FormGroup>
            {availableAirlines.slice(0, 12).map((airline) => (
              <FormControlLabel
                key={airline}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => handleAirlineToggle(airline)}
                  />
                }
                label={
                  <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                    {airline}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary">
        {resultCount} flight{resultCount !== 1 ? 's' : ''} match
      </Typography>
    </Box>
  )
}
