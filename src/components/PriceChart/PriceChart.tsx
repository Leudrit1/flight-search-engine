import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Box, Paper, Typography } from '@mui/material'
import type { FlightOffer } from '@/types/flight'

interface PriceChartProps {
  flights: FlightOffer[]
}

const BUCKET_SIZE = 50

export function PriceChart({ flights }: PriceChartProps) {
  const data = useMemo(() => {
    if (flights.length === 0) return []

    const min = Math.min(...flights.map((f) => f.price))
    const max = Math.max(...flights.map((f) => f.price))
    const range = max - min || 1
    const bucketCount = Math.min(12, Math.ceil(range / BUCKET_SIZE) || 1)
    const step = range / bucketCount

    const buckets: { range: string; count: number; min: number; max: number }[] = []

    for (let i = 0; i < bucketCount; i++) {
      const bucketMin = min + i * step
      const bucketMax = i === bucketCount - 1 ? max + 0.01 : min + (i + 1) * step
      const count = flights.filter(
        (f) => f.price >= bucketMin && f.price < bucketMax
      ).length
      buckets.push({
        range: `€${Math.round(bucketMin)}-${Math.round(bucketMax)}`,
        count,
        min: bucketMin,
        max: bucketMax,
      })
    }

    return buckets
  }, [flights])

  if (flights.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 280 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No data to display. Run a search to see the price distribution.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Price Distribution
      </Typography>
      <Box sx={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v}
            />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number) => [`${value} flights`, 'Count']}
              labelFormatter={(label) => `Price: ${label}`}
            />
            <Bar dataKey="count" fill="#0d47a1" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? '#0d47a1' : '#5472d3'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
