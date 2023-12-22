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

export const MisProyectos = (): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [apuntes, setApuntes] = useState<apuntesValues[]>([])
  const tokenUser = localStorage.getItem('tokenUser')
  const [allCursos, setAllCursos] = useState<productosValues[]>([])

  const getApuntes = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getArchivoss`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setApuntes(request.data)
  }

  const descargarArchivo = async (nombre: string): Promise<void> => {
    const response = await axios.get(
      `${Global.url}/descargarRecurso/${nombre ?? ''}`,
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

  const getAllCursos = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/allProductos`)
      setAllCursos(request.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (auth.id) {
      getApuntes()
      getAllCursos()
    }
  }, [auth.id])

  //   function extraerNumeroDesdeURL (url: string): string | null {
  //     const match = url.match(/\d+/) // Encuentra una secuencia de uno o más dígitos
  //     return match ? match[0] : null // Devuelve el primer número encontrado o null si no hay ningún número
  //   }

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
              MIS PROYECTOS
            </h1>
            <p className="text-gray-300 text-2xl w-full px-6 lg:px-0 lg:w-[60%] mx-auto text-center">
              Esta es tu área personal donde podrás acceder a todos los archivos
              cargados en los diferentes cursos que haz llevado durante tu
              aprendizaje.
            </p>
          </section>
        </div>
        <section className="w-[80%] mx-auto f">
          {allCursos.map((curso, indexCurso: number) => {
            const contenidoCurso = JSON.parse(curso.contenido)
            const tieneContenido = contenidoCurso.some((conten: any) =>
              conten.codClases.some((cod: any) =>
                apuntes.some(
                  (apunte: any) =>
                    apunte.archivos &&
                  JSON.parse(apunte.archivos).some(
                    (archivo: any) => archivo.clase === cod && archivo.user === auth.id
                  )
                )
              )
            )

            if (tieneContenido) {
              return (
                <div key={indexCurso} className="flex flex-col gap-10 mb-10">
                  <h1 className="text-4xl font-bold">{curso.nombre}</h1>
                  {contenidoCurso.map((conten: any) =>
                    conten.codClases.map((cod: any) =>
                      apuntes.map((apunte, index: number) => {
                        const archivosFiltrados =
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                          apunte.archivos &&
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          JSON.parse(apunte.archivos).filter(
                            (archivo: any) => archivo.clase === cod
                          )
                        if (archivosFiltrados && archivosFiltrados.length > 0) {
                          return (
                            <div key={index}>
                              {archivosFiltrados.filter((archivo: any) => archivo.user == auth.id).map(
                                (archivo: any, indexa: number) => (
                                  <div
                                    key={indexa}
                                    className="bg-[#24385b] rounded-xl w-full h-fit flex gap-3 items-start hover:bg-[#24385b80] transition-colors cursor-pointer relative flex-col p-6"
                                  >
                                    <h2 className="text-3xl">
                                      Contenido : {archivo.texto}
                                    </h2>
                                    <div className="relative mt-6 flex gap-3 items-center">
                                      {archivo.respuestas && (
                                        <p
                                          className="w-full line-clamp-1 text-blue-600 text-2xl"
                                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                                          onClick={async () => {
                                            await descargarArchivo(
                                              archivo.respuestas
                                            )
                                          }}
                                        >
                                          Archivo: {archivo.respuestas}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        } else {
                          return null // No hay archivos para este código de clase
                        }
                      })
                    )
                  )}
                </div>
              )
            } else {
              return null // No hay contenido para este curso
            }
          })}
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
