import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { InstallPrompt } from './app/InstallPrompt'
import { Header } from './app/layout/Header'
import { Breadcrumbs } from './app/routing/Breadcrumbs'
import NotFound from './app/routing/NotFound'
import BatchesPage from './features/batches/ui/BatchesPage'
import BatchDetailsPage from './features/batches/ui/BatchDetailsPage'
import WeightsPage from './features/weights/ui/WeightsPage'
import EggsPage from './features/eggs/ui/EggsPage'
import ExpensesPage from './features/expenses/ui/ExpensesPage'
import MedicationsPage from './features/medications/ui/MedicationsPage'
import MortalityPage from './features/mortality/ui/MortalityPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black">
        <Header />
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<BatchesPage />} />
          <Route path="/batches/:id" element={<BatchDetailsPage />} />
          <Route path="/batches/:id/weights" element={<WeightsPage />} />
          <Route path="/batches/:id/eggs" element={<EggsPage />} />
          <Route path="/batches/:id/expenses" element={<ExpensesPage />} />
          <Route path="/batches/:id/medications" element={<MedicationsPage />} />
          <Route path="/batches/:id/mortality" element={<MortalityPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <InstallPrompt />
      </div>
    </BrowserRouter>
  )
}
