import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/css/globals.css'
import '../styles/css/admin.css'

import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import TituloSitu from '../components/TituloSitu'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <TituloSitu />
      <Menu />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
