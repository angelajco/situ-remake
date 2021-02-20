import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/css/globals.css'

import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Menu />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp
