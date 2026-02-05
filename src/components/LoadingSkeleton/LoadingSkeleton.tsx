import { Box, Skeleton } from '@mui/material'

export function FlightGridSkeleton() {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={52}
          sx={{ mb: 0.5, borderRadius: 1 }}
        />
      ))}
    </Box>
  )
}

export function ChartSkeleton() {
  return (
    <Box sx={{ width: '100%', height: 280 }}>
      <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
    </Box>
  )
}
