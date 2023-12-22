import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { type valuesSecciones } from '../../../../shared/Interfaces'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import Swal from 'sweetalert2'
interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setSecciones: Dispatch<SetStateAction<valuesSecciones[]>>
  idClase: string | undefined
  idCurso: string | undefined
  getOneData: () => Promise<void>
}

export const AgregarSeccion = ({
  open,
  setOpen,
  setSecciones,
  idClase,
  idCurso,
  getOneData
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [texto, setTexto] = useState('')
  const token = localStorage.getItem('token')
  const agregarSeccion = (): void => {
    if (texto) {
      const nuevaSeccion = {
        id: uuidv4(),
        tituloSeccion: texto, // Cambio aquí
        idClase,
        archivos: [] // inicialmente vacío
      }
      setSecciones((seccionesAnteriores) => {
        const nuevoRecurso = [...seccionesAnteriores, nuevaSeccion]
        const enviarDatos = async (): Promise<void> => {
          const data = new FormData()
          data.append('recursos', JSON.stringify(nuevoRecurso))
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
              Swal.fire('Seccion agregada', '', 'success')
              setTexto('')
              setOpen(false)
              getOneData()
            } else {
              Swal.fire('Error al agregar', '', 'warning')
            }
          } catch (error: unknown) {
            Swal.fire('Error al agregar', '', 'error')
          }
        }
        enviarDatos()
        return nuevoRecurso
      })
      setTexto('')
      setOpen(false)
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
    >
      <DialogContent className="w-[500px]">
        <h2 className="uppercase font-bold text-2xl w-full text-center">
          Agregar nueva sección
        </h2>
        <div className="mt-10 w-full">
          <input
            type="text"
            placeholder="Nombre de la sección"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value)
            }}
            className="border px-4 py-2 w-full text-xl text-black outline-none border-gray-400 placeholder:text-black/70"
          />
        </div>
        <button
          className="text-white bg-green-600 px-4 py-2 mt-10 rounded-xl mx-auto w-fit block"
          type="button"
          onClick={() => {
            agregarSeccion()
          }}
        >
          Agregar
        </button>
      </DialogContent>
    </Dialog>
  )
}
