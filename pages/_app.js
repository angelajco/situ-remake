import 'bootstrap/dist/css/bootstrap.min.css'
import '../shared/styles/css/globals.css'
import '../shared/styles/css/pagina-principal.css'
import '../shared/styles/css/admin.css'
import '../shared/styles/css/analisis.css'
import '../shared/styles/css/analisis-estadisticas.css'
import '../shared/styles/css/consulta-documental.css'
import '../shared/styles/css/pagination.css'

import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'

import { useEffect } from 'react'
import '../config/i18n'

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    function isItIE() {
      var user_agent = navigator.userAgent;
      var is_it_ie = user_agent.indexOf("MSIE ") > -1 || user_agent.indexOf("Trident/") > -1;
      return is_it_ie;
    }
    if (isItIE()) {
      alert('Este sitio no se puede usar en Internet EXplorer, favor de abrirlo en otro navegador de su preferencia.');
    }
  }, [])

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
