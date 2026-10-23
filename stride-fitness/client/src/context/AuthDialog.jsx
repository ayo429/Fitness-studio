import { createContext, useContext, useState } from 'react'
import AuthModal from '../components/AuthModal'

// A "context" shares one thing with every component without passing it down by hand.
// Here the shared thing is a function, openAuth(), that opens the sign-in pop-up.
// That way the Navbar and the plan buttons can both open the same pop-up.
const AuthDialogContext = createContext({ openAuth: () => {} })

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthDialog = () => useContext(AuthDialogContext)

export function AuthDialogProvider({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <AuthDialogContext.Provider value={{ openAuth: () => setOpen(true) }}>
      {children}
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </AuthDialogContext.Provider>
  )
}