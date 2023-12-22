import { Outlet } from 'react-router-dom'
import { Header } from './estructura/Header'
import { Footer } from './estructura/Footer'

export const PublicLayout = (): JSX.Element => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
