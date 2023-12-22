import useAuth from '../../../../hooks/useAuth'
import { NavBarLeft } from '../clases/navbar/NavBarLeft'
import { MenuPerfill } from '../clases/navbar/MenuPerfill'
import { Header } from '../../../public/estructura/Header'
import { useEffect, useState } from 'react'
import {
  type productosValues,
  type apuntesValues
} from '../../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { RiDownloadCloudLine } from 'react-icons/ri'

export const MisConstancias = (): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [certificados, setcertificados] = useState<apuntesValues[]>([])
  const tokenUser = localStorage.getItem('tokenUser')
  const [allCursos, setAllCursos] = useState<productosValues[]>([])

  const getCertificados = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showCertificados/${auth.id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    setcertificados(request.data)
  }

  const getAllCursos = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/allProductos`)
      setAllCursos(request.data)
    } catch (error) {}
  }

  const descargarArchivo = async (nombre: string): Promise<void> => {
    const response = await axios.get(
      `${Global.url}/descargarRecurso2/${nombre ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        },
        responseType: 'blob'
      }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nombre) // Asigna el nombre al archivo descargado
    document.body.appendChild(link)
    link.click()

    // Limpieza después de la descarga
    if (link.parentNode) {
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  useEffect(() => {
    if (auth.id) {
      getCertificados()
      getAllCursos()
    }
  }, [auth.id])

  return (
    <>
      <NavBarLeft open={open} />
      <div className="md:hidden">
        <Header />
      </div>
      <MenuPerfill />
      <section className="bg-primary py-20  font_baloo lg:pl-[280px] min-h-screen">
        <div className="w-full max-w-[1450px] px-6 lg:px-20 mx-auto">
          <section className="flex flex-col gap-10 mb-20">
            <h1 className="text-white font-semibold text-5xl w-full text-center">
              MIS CONSTANCIAS
            </h1>
            <p className="text-gray-300 text-2xl w-full px-6 lg:px-0 lg:w-[60%] mx-auto text-center">
              Esta es tu área personal donde podrás acceder a todos tus
              certificados otorgados en los diferentes cursos que haz llevado
              durante tu aprendizaje.
            </p>
          </section>
        </div>
        <section className="w-[80%] mx-auto f">
          {allCursos
            .filter((curso) =>
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              certificados.some((certi) => certi.id_curso == curso.id)
            )
            .map((curso) => (
              <div key={curso.id} className="flex flex-col gap-10 mb-10 ">
                {certificados
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  .filter((certi) => certi.id_curso == curso.id)
                  .map((certificado, index: number) => (
                    <div
                      className="flex justify-between items-center"
                      key={index}
                    >
                      <div className="flex gap-3 items-center ">
                        <img
                          src={`${Global.urlImages}/productos/${curso.imagen1}`}
                          alt=""
                          className="w-20 h-20 object-cover rounded-full"
                        />
                        <div>
                          <h2 className="text-gray-200 font-semibold text-3xl">
                            {curso.nombre} -{' '}
                            <span className="text-secondary-70">100%</span>
                          </h2>
                          <span className="text-secondary-70 text-2xl">
                            Felicidades por aprobar el curso
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex gap-3 justify-center items-center flex-col cursor-pointer"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async () => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          await descargarArchivo(certificado.pdf)
                        }}
                      >
                        <div className="bg-secondary-70 rounded-full p-2">
                          <RiDownloadCloudLine className="text-white text-4xl" />
                        </div>
                        <button className="text-2xl">
                          Descargar certificado
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </section>
      </section>

      <button
        id=""
        className="fixed right-6 bottom-6 rounded-full bg-white w-16 h-16 z-20 md:hidden"
        onClick={() => {
          setOpen(!open)
        }}
      >
        <span className="fa fa-bars text-primary text-[2.4rem] "></span>
      </button>
    </>
  )
}
