import { useMemo } from 'react'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import type { FlightOffer } from '@/types/flight'

interface FlightDataGridProps {
  flights: FlightOffer[]
  loading?: boolean
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function formatStops(stops: number): string {
  if (stops === 0) return 'Non-stop'
  if (stops === 1) return '1 stop'
  return `${stops} stops`
}

export function FlightDataGrid({ flights, loading }: FlightDataGridProps) {
  const rows: GridRowsProp = useMemo(
    () =>
      flights.map((f) => ({
        id: f.id,
        airline: f.airline,
        airlineCode: f.airlineCode,
        route: `${f.origin} → ${f.destination}`,
        departure: f.departureDate,
        duration: formatDuration(f.durationMinutes),
        stops: formatStops(f.stops),
        price: f.price,
        currency: f.currency,
      })),
    [flights]
  )

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'airline',
        headerName: 'Airline',
        flex: 1,
        minWidth: 140,
        resizable: true,
      },
      {
        field: 'route',
        headerName: 'Route',
        flex: 1,
        minWidth: 120,
        resizable: true,
      },
      {
        field: 'departure',
        headerName: 'Departure',
        width: 110,
        resizable: true,
      },
      {
        field: 'duration',
        headerName: 'Duration',
        width: 100,
        resizable: true,
      },
      {
        field: 'stops',
        headerName: 'Stops',
        width: 100,
        resizable: true,
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 100,
        resizable: true,
        valueFormatter: (value: unknown, row) =>
          `${row.currency} ${Number(value).toFixed(2)}`,
      },
    ],
    []
  )

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
          sorting: {
            sortModel: [{ field: 'price', sort: 'asc' }],
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        columnVisibilityModel={{
          airlineCode: false,
        }}
        sx={{
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
        }}
      />
    </Box>
  )
}
