import { PiFileArchiveLight } from 'react-icons/pi'
import {
  type archivoValuess,
  type valuesSecciones
} from '../../../../shared/Interfaces'
import { formatearNombreArchivo } from '../../../../shared/funtions/functions'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { type Dispatch, type SetStateAction } from 'react'
import { CiSaveDown2 } from 'react-icons/ci'

interface valuesProps {
  secciones: valuesSecciones[]
  claseId: string | undefined
  tokenUser: string | null
  setLoadingDescarga: Dispatch<SetStateAction<boolean>>
  loadingDescarga: boolean
}

export const Secciones = ({ secciones, claseId, tokenUser, setLoadingDescarga, loadingDescarga }: valuesProps): JSX.Element => {
  const descargarArchivo = async (nombre: string): Promise<void> => {
    setLoadingDescarga(true)
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
    setLoadingDescarga(false)
  }

  return (
    <section className='w-full lg:min-h-[200px]'>
      {secciones
        .filter((seccion) => seccion.idClase == claseId)
        .map((seccion, index: number) => (
          <div
            className="w-full pt-20 pb-0 px-10 border-b border-secondary-10"
            key={index}
          >
            <h3 className="text-4xl">{seccion.tituloSeccion}</h3>
            {seccion.archivos.map((archivo: archivoValuess) => {
              if (archivo.tipo == 'texto') {
                return (
                  <div
                    className="pt-10 pb-5 flex items-center justify-between"
                    key={archivo.id}
                  >
                    <div className="flex gap-1 items-center">
                      <PiFileArchiveLight className="text-secondary-50 text-5xl " />
                      <div className="flex-1 flex flex-col gap-1 pl-6">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: archivo.contenido
                          }}
                          className="w-full text-2xl text-gray-400 forzar_color"
                        />
                      </div>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div
                    className="pt-10 pb-5 flex items-center justify-between"
                    key={archivo.id}
                  >
                    <div className="flex gap-1 items-center">
                      <PiFileArchiveLight className="text-secondary-50 text-5xl" />
                      <div className="flex-1 flex flex-col gap-1 pl-6">
                        <span className="text-2xl text-gray-400 flex items-center gap-3">
                          {formatearNombreArchivo(archivo.contenido)}
                        </span>
                      </div>
                    </div>
                    <button>
                      {!loadingDescarga
                        ? (
                        <CiSaveDown2
                          className="text-4xl cursor-pointer"
                          onClick={async () => {
                            await descargarArchivo(archivo.contenido)
                          }}
                        />
                          )
                        : (
                        <CiSaveDown2 className="text-4xl cursor-pointer text-gray-600" />
                          )}
                    </button>
                  </div>
                )
              }
            })}
          </div>
        ))}
    </section>
  )
}
