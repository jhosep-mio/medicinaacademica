import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import upload from './../../../../../assets/modals/uploadInformes.png'
import { type valuesSecciones } from '../../../../shared/Interfaces'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'

interface values {
  id: string | undefined
  getOneBrief: any
  seleccion: string
  secciones: valuesSecciones[]
  IdSeccion: string | undefined
  idCurso: string | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  setSecciones: Dispatch<SetStateAction<valuesSecciones[]>>
}

export const CargarArchivos = ({
  getOneBrief,
  seleccion,
  secciones,
  IdSeccion,
  idCurso,
  setSecciones,
  setOpen
}: values): JSX.Element => {
  const [progress, setProgress] = useState(0)
  const [cargando, setCargando] = useState(false)
  //   const [uplo, setUpload] = useState('')
  const token = localStorage.getItem('tokenProfesor')

  const agregarArchivoASeccion = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    let nuevoContenido: any
    const file = event.target.files?.[0]
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const nombreUnicoArchivo = `${uuidv4()}_${file?.name}`
    if (seleccion == 'archivo') {
      nuevoContenido = {
        id: uuidv4(),
        tipo: seleccion,
        contenido: nombreUnicoArchivo
      }
    }
    const seccionesActualizadas = secciones.map((seccion) =>
      seccion.id == IdSeccion
        ? { ...seccion, archivos: [...seccion.archivos, nuevoContenido] }
        : seccion
    )
    const enviarDatos = async (): Promise<void> => {
      setCargando(true)
      const data = new FormData()
      if (file) {
        data.append('archivo', file, nombreUnicoArchivo) // Agrega el archivo con el nombre único
      }
      data.append('recursos', JSON.stringify(seccionesActualizadas))
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
          `${Global.url}/agregarSeccionConArchivo2/${idCurso ?? ''}`,
          data,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total != undefined) {
                const progressPercentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                setProgress(progressPercentage)
              }
            },
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )
        if (respuesta.data.status == 'success') {
          setSecciones(seccionesActualizadas)
          Swal.fire('Archivo subido', '', 'success')
          setOpen(false)
          getOneBrief()
        } else {
          Swal.fire('Error al subir', '', 'error')
        }
      } catch (error: unknown) {
        Swal.fire('Error al subir', '', 'error')
      }
      setCargando(false)
    }
    enviarDatos()
  }

  return (
    <section className="w-full min-h-[200px] flex flex-col justify-between">
      {!cargando
        ? <div className="relative w-full h-fit">
          <input
            className="w-full h-[200px] absolute inset-0 opacity-0 cursor-pointer mx-auto"
            type="file"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onChange={agregarArchivoASeccion}
          />
          <img
            src={upload}
            alt=""
            className="object-contain w-full h-[200px]"
          />
        </div>
        : (
        <section className="w-full h-full flex justify-center items-center">
          <div className="progressbar mx-auto">
            <p>
              <span>{progress}</span>%
            </p>
            <span
              className="progressbar__up"
              style={{ height: `${progress}%` }}
            ></span>
          </div>
        </section>
          )}
      {/* <div
        className="px-4"
        style={
          uplo == 'success' || uplo == 'error'
            ? { justifyContent: 'space-between' }
            : { justifyContent: 'flex-end' }
        }
      >
        {uplo == 'success'
          ? (
          <p
            style={{
              color: 'green',
              fontWeight: 'bold',
              fontSize: '18px',
              textAlign: 'center'
            }}
          >
            Se subieron correctamente los archivos
          </p>
            )
          : uplo == 'error'
            ? (
          <p
            style={{
              color: 'red',
              fontWeight: 'bold',
              fontSize: '18px',
              textAlign: 'center'
            }}
          >
            Error al subir los archivos
          </p>
              )
            : (
                ''
              )}
      </div> */}
    </section>
  )
}
