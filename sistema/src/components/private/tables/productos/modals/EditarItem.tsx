import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import {
  type valuesEdicionItem,
  type Clase
} from '../../../../shared/Interfaces'
import Editor2 from '../../../../shared/Editar2'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  pased: valuesEdicionItem | null
  clases: Clase[]
  setClases: Dispatch<SetStateAction<Clase[]>>
  examenes: never[]
}

interface valuesExamen {
  titulo: string
  id: string
}

export const EditarItem = ({
  open,
  setOpen,
  pased,
  clases,
  setClases,
  examenes
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const [contenido, setContenido] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [enlace, setEnlace] = useState('')
  const [tipo, setTipo] = useState('')

  useEffect(() => {
    if (open && pased) {
      setContenido(pased.contenido)
      setTiempo(pased.tiempo)
      setEnlace(pased.enlace)
      setTipo(pased.tipo)
    }
  }, [open, pased, tipo])

  const handleSave = (): void => {
    if (pased != null) {
      // Aquí la lógica para actualizar el ítem en `clases`
      const clasesActualizadas = clases.map((clase, index) => {
        if (index == pased.claseIndex) {
          if (tipo == 'Examen') {
            const nuevaClase = { ...clase }
            const datos: valuesExamen[] = examenes.filter((examen: { id: number }) => String(examen.id) == enlace)
            nuevaClase.contenido[pased.itemIndex] = datos[0].titulo
            nuevaClase.tiemposClase[pased.itemIndex] = '0'
            nuevaClase.linkClases[pased.itemIndex] = datos[0].id
            console.log(nuevaClase)
            return nuevaClase
          } else {
            const nuevaClase = { ...clase }
            nuevaClase.contenido[pased.itemIndex] = contenido
            nuevaClase.tiemposClase[pased.itemIndex] = tiempo
            nuevaClase.linkClases[pased.itemIndex] = enlace
            return nuevaClase
          }
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
              {tipo == 'Clase'
                ? 'Editar Clase'
                : tipo == 'Tarea'
                  ? 'Editar Tarea'
                  : tipo == 'Examen'
                    ? 'Editar Examen'
                    : ''}
            </h2>
            {tipo == 'Clase'
              ? (
              <>
                <input
                  className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                  type="text"
                  placeholder="Item clase"
                  id="textI"
                  value={contenido}
                  onChange={(e) => {
                    setContenido(e.target.value)
                  }}
                />
                <input
                  className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                  type="text"
                  placeholder="Tiempo de clase"
                  id="tiempoI"
                  value={tiempo}
                  onChange={(e) => {
                    setTiempo(e.target.value)
                  }}
                />
                <input
                  className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                  type="text"
                  placeholder="Link de clase"
                  id="tiempoI"
                  value={enlace}
                  onChange={(e) => {
                    setEnlace(e.target.value)
                  }}
                />
              </>
                )
              : tipo == 'Tarea'
                ? (
              <>
                <input
                  className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                  type="text"
                  placeholder="Titiulo de la tarea"
                  id="textI"
                  value={contenido}
                  onChange={(e) => {
                    setContenido(e.target.value)
                  }}
                />
                <input
                  className="text-white border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                  type="text"
                  placeholder="Tiempo estimado"
                  id="tiempoI"
                  value={tiempo}
                  onChange={(e) => {
                    setTiempo(e.target.value)
                  }}
                />
                <div className="mt-6">
                  <Editor2 content={enlace} setContent={setEnlace} />
                </div>
              </>
                  )
                : tipo == 'Examen'
                  ? (
              <div className="flex w-full items-center gap-6">
                <select
                  name=""
                  id=""
                  value={enlace}
                  onChange={(e) => {
                    setEnlace(e.target.value)
                  }}
                  className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                >
                  <option value="">Seleccionar examen</option>
                  {examenes.map(
                    (examen: { id: number, titulo: string }, index) => (
                      <option
                        value={examen.id}
                        className=""
                        key={index}
                      >
                        {examen.titulo}
                      </option>
                    )
                  )}
                </select>
              </div>
                    )
                  : null}

            <button
              type="button"
              onClick={() => {
                handleSave()
              }}
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
