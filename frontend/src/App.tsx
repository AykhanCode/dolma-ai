import { Toaster } from 'react-hot-toast'
import { AppRouter } from './router'

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#00CC88',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default App
