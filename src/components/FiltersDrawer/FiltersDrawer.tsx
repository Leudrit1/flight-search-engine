import { Drawer, IconButton, Box } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'

interface FiltersDrawerProps {
  open: boolean
  onClose: () => void
  onOpen: () => void
  children: React.ReactNode
}

export function FiltersDrawer({ open, onClose, onOpen, children }: FiltersDrawerProps) {
  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{ display: { md: 'none' } }}
        aria-label="Open filters"
      >
        <FilterListIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: 280, p: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Drawer>
    </>
  )
}
