import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes/AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DialogProvider } from './context/dialog'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <DialogProvider>
    <AppRoutes />
    </DialogProvider>
    </QueryClientProvider>
  </StrictMode>,
)
