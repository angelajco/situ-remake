import 'bootstrap/dist/css/bootstrap.min.css'
import '../shared/styles/css/globals.css'
import '../shared/styles/css/admin.css'

import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import TituloSitu from '../components/TituloSitu'

import '../config/i18n'

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
