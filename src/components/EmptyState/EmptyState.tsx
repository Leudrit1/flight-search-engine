import { Box, Typography, Button } from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

interface EmptyStateProps {
  title?: string
  description?: string
  onAction?: () => void
  actionLabel?: string
}

export function EmptyState({
  title = 'No flights to show',
  description = 'Use the search form above to find flights. Try popular routes or enter your own origin and destination.',
  onAction,
  actionLabel = 'Search flights',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <FlightTakeoffIcon
        sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mb: 2 }}>
        {description}
      </Typography>
      {onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
