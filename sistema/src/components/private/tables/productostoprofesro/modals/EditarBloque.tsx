import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { type Clase } from '../../../../shared/Interfaces'
import { TitleBriefs } from '../../../../shared/TitleBriefs'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  pased: Clase
  clases: Clase[]
  setClases: Dispatch<SetStateAction<Clase[]>>
}

export const EditarBloque = ({
  open,
  setOpen,
  pased,
  clases,
  setClases
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [tituloEditado, setTituloEditado] = useState('')

  useEffect(() => {
    setTituloEditado(pased.titulo)
  }, [pased.titulo])

  const actualizarTituloClase = async (claseId: string, nuevoTitulo: string): Promise<void> => {
    try {
      setClases(clases.map((clase: Clase) => {
        if (clase.id == claseId) {
          return { ...clase, titulo: nuevoTitulo }
        }
        return clase
      }))
    } catch (error) {
      console.error('Error al actualizar el título', error)
      // Manejar el error como corresponda
    }
  }

  const handleEdit = (): void => {
    actualizarTituloClase(pased.id, tituloEditado)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_bloque"
    >
      <DialogContent className="">
        <div className="lg:relative flex flex-col justify-between gap-2 w-[500px]">
          <div className="w-full gap-6 items-center">
            <h2 className="font-medium text-white w-full mb-8 text-center uppercase text-xl underline">
              Editar titulo del curso
            </h2>
            <TitleBriefs titulo="Título de clase" />
            <input
              className=" text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
              type="text"
              id="tituloI"
              placeholder="Título de la clase"
              value={tituloEditado}
              onChange={(e) => { setTituloEditado(e.target.value) }}
            />
            <button
              type="button"
              onClick={() => { handleEdit() }}
              className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer mt-10 mx-auto uppercase"
            >
              Editar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
