import { useEffect, useState } from 'react'
import { Global } from '../../helper/Global'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Certificados = (): JSX.Element => {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const { name } = useParams()
  useEffect(() => {
    const getPdfBlob = async (): Promise<void> => {
      try {
        const response = await axios.get(
          `${Global.url}/getCerti/${name ?? ''}.pdf`,
          { responseType: 'blob' }
        )
        setPdfBlob(response.data)
      } catch (error) {
        console.error('Error al obtener el PDF', error)
      }
    }

    getPdfBlob()
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
        <section className="fondo_screen flex items-center justify-center">
        {pdfBlob && (
          <iframe
            src={URL.createObjectURL(pdfBlob)}
            width="1000"
            height="700"
            title="PDF Viewer"
          />
        )}
      </section>
    </>
  )
}

export default Certificados
