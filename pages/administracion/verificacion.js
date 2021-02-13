import Router, { useRouter } from 'next/router'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Verificacion() {

  const router = useRouter()
  // console.log(router.query['permalink'])

  const [datosPeticion, setDatosPeticion] = useState([])

  useEffect(() => {
    // if (router.query['permalink'] != undefined) {
    var config = {
      method: 'get',
      url: 'http://172.16.117.11/wa/verifyEmail',
      params: {
        permalink: 'GjoSkxGGwP5J6yPgeGZoR166mmbv08NYrTYefe/srg4qakUvfgil9VF6YWznogMg1eaUo02DAfmJ+ESOJX4wAZE4SwjA4JX803L3mAN7mT/qwD4VMphCU/SxeLlVS3Uz9ONi+6HjQNtxafzTqR0qQKTWvdJfnIh3b55ibuuTPrcpTFntBlkIFmHJGdvAHjG5zDiea8tMxjIHGKyBuOgSH10GvWmj4o6GSqXPuIrxKJfekfKLgrP/4VXarnP/bl/3hlf9VkUi8qo98QPxoasXKzNNukKzEhoYEDhSIixxGTOPsfyvpx9HIgp1qZPulamfDK8JiDPA/Yf+131GxstvgA='
      },
    };

    axios(config)
      .then(function (response) {
        console.log("exito")
        console.log(response)
        setDatosPeticion(response.data);
      })
      .catch(function (error) {
        console.log(error)
        Router.push('/')
      });
  }, [])

  return (
    <>
      <div className="container tw-text-center">
        <div className="row">
          <div className="col-12">
            <p>{datosPeticion['message-subject']}</p>
          </div>
        </div>
      </div>
    </>
  )
}