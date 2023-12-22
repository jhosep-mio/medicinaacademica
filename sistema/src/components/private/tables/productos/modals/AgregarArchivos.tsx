import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { type valuesSecciones } from '../../../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import Swal from 'sweetalert2'
import Editor from '../../../../shared/Editar'
import { CargarArchivos } from './CargarArchivos'
import { v4 as uuidv4 } from 'uuid'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setSecciones: Dispatch<SetStateAction<valuesSecciones[]>>
  secciones: valuesSecciones[]
  idClase: string | undefined
  idCurso: string | undefined
  getOneData: () => Promise<void>
  IdSeccion: string | undefined
}

export const AgregarArchivos = ({
  open,
  setOpen,
  setSecciones,
  idCurso,
  getOneData,
  secciones,
  IdSeccion
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [texto, setTexto] = useState('')
  const [seleccion, setseleccion] = useState('')
  const token = localStorage.getItem('token')

  const agregarArchivoASeccion = (): void => {
    if (texto && seleccion) {
      let nuevoContenido: any
      if (seleccion == 'texto') {
        nuevoContenido = { id: uuidv4(), tipo: 'texto', contenido: texto }
      }
      const seccionesActualizadas = secciones.map((seccion) =>
        seccion.id == IdSeccion
          ? { ...seccion, archivos: [...seccion.archivos, nuevoContenido] }
          : seccion
      )
      const enviarDatos = async (): Promise<void> => {
        const data = new FormData()
        data.append('recursos', JSON.stringify(seccionesActualizadas))
        data.append('_method', 'PUT')
        try {
          const respuesta = await axios.post(
            `${Global.url}/agregarSeccion/${idCurso ?? ''}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
          )
          if (respuesta.data.status == 'success') {
            setSecciones(seccionesActualizadas)
            Swal.fire('Se subio correctamente', '', 'success')
            setTexto('')
            setOpen(false)
            getOneData()
          } else {
            Swal.fire('Error al subir', '', 'error')
          }
        } catch (error: unknown) {
          Swal.fire('Error al subir', '', 'error')
        }
      }
      enviarDatos()
    } else {
      Swal.fire('Complete los campos', '', 'warning')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className='modal_index'
    >
      <DialogContent className="w-[500px]">
        <h2 className="uppercase font-bold text-2xl w-full text-center">
          Cargar contenido
        </h2>
        <div className="mt-10 w-full flex flex-col gap-4">
          <select
            name=""
            id=""
            value={seleccion}
            onChange={(e) => {
              setseleccion(e.target.value)
            }}
            className="text-center font-bold border-2 rounded-xl px-4 py-2 outline-none"
          >
            <option value="">Seleccionar</option>
            <option value="archivo">Archivo</option>
            <option value="texto">Texto</option>
          </select>
          {seleccion == 'texto'
            ? (
            <>
              <Editor content={texto} setContent={setTexto} />
              <button
                className="text-white bg-green-600 px-4 py-2 mt-16 rounded-xl mx-auto w-fit block"
                type="button"
                onClick={() => {
                  agregarArchivoASeccion()
                }}
              >
                Agregar
              </button>
            </>
              )
            : (
                seleccion == 'archivo' && (
              <CargarArchivos
                id={idCurso}
                getOneBrief={getOneData}
                setSecciones={setSecciones}
                seleccion={seleccion}
                secciones={secciones}
                IdSeccion={IdSeccion}
                setOpen={setOpen}
                idCurso={idCurso}
              />
                )
              )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
