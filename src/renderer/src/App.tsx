import { useLocation, useRoutes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { cloneElement } from 'react'

function App(): JSX.Element | null {
  const element = useRoutes([
    {
      path: '/',
      element: <h1>Home</h1>
    }
  ])

  const location = useLocation()

  if (!element) return null

  return (
    <AnimatePresence mode="wait" initial={false}>
      {cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  )
}

export default App
