import { Toaster } from 'react-hot-toast'

export default function ToasterComponent(): JSX.Element {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#363636',
          color: '#ffffffdd',
          fontSize: '1.2rem'
        },
        success: {
          duration: 3000,
          style: {
            background: '#a7f3d0',
            color: '#242424'
          }
        },
        error: {
          duration: 3000,
          style: {
            background: '#fda4af',
            color: '#242424'
          }
        },
        loading: {
          duration: Infinity
        }
      }}
    />
  )
}
