import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { type valuesEdicionItem, type Clase } from '../../../../shared/Interfaces'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  pased: valuesEdicionItem | null
  clases: Clase[]
  setClases: Dispatch<SetStateAction<Clase[]>>
}

export const EditarItem = ({
  open,
  setOpen,
  pased,
  clases,
  setClases
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const [contenido, setContenido] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [enlace, setEnlace] = useState('')

  useEffect(() => {
    if (open && pased) {
      setContenido(pased.contenido)
      setTiempo(pased.tiempo)
      setEnlace(pased.enlace)
    }
  }, [open, pased])

  const handleSave = (): void => {
    if (pased != null) {
      // Aquí la lógica para actualizar el ítem en `clases`
      const clasesActualizadas = clases.map((clase, index) => {
        if (index == pased.claseIndex) {
          const nuevaClase = { ...clase }
          nuevaClase.contenido[pased.itemIndex] = contenido
          nuevaClase.tiemposClase[pased.itemIndex] = tiempo
          nuevaClase.linkClases[pased.itemIndex] = enlace
          return nuevaClase
        }
        return clase
      })
      setClases(clasesActualizadas)
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_bloque"
    >
      <DialogContent className="w-[500px]">
        <div className="w-full lg:relative  mb-5 flex flex-col justify-between gap-2">
          <div className="w-full gap-6 items-center">
            <h2 className="font-medium text-white w-full mb-8 text-center uppercase text-xl underline">
              Editar item
            </h2>

            <input
              className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
              type="text"
              placeholder="Item clase"
              id="textI"
              value={contenido}
              onChange={(e) => { setContenido(e.target.value) }}
            />
            <input
              className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
              type="text"
              placeholder="Tiempo de clase"
              id="tiempoI"
              value={tiempo}
              onChange={(e) => { setTiempo(e.target.value) }}
            />
            <input
              className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
              type="text"
              placeholder="Link de clase"
              id="tiempoI"
              value={enlace}
              onChange={(e) => { setEnlace(e.target.value) }}
            />
            <button
              type="button"
              onClick={() => { handleSave() }}
              className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex mt-10 mx-auto items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
