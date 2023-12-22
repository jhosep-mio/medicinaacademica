import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { type Clase } from '../../../../shared/Interfaces'
import { v4 as uuidv4 } from 'uuid'
import Editor2 from '../../../../shared/Editar2'
import Swal from 'sweetalert2'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  newItemToBloque: number | null
  clases: Clase[]
  setClases: Dispatch<SetStateAction<Clase[]>>
  examenes: never[]
}

export const AgregarNewItems = ({
  open,
  setOpen,
  newItemToBloque,
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

  const agregarNuevoItem = (): void => {
    if (newItemToBloque !== null && tiempo && tipo == 'Examen') {
      const nuevasClases = [...clases]
      const bloque = nuevasClases[newItemToBloque]

      const datos = JSON.parse(tiempo)

      bloque.contenido.push(datos.titulo)
      bloque.tiemposClase.push('0')
      bloque.linkClases.push(datos.id)
      bloque.codClases.push(uuidv4())
      bloque.tipos.push(tipo)
      setClases(nuevasClases)
      setContenido('')
      setEnlace('')
      setTiempo('')
      setTipo('')
      setOpen(false)
    } else if (newItemToBloque !== null && contenido && tiempo && enlace && tipo) {
      const nuevasClases = [...clases]
      const bloque = nuevasClases[newItemToBloque]
      bloque.contenido.push(contenido)
      bloque.tiemposClase.push(tiempo)
      bloque.linkClases.push(enlace)
      bloque.codClases.push(uuidv4())
      bloque.tipos.push(tipo)
      setClases(nuevasClases)
      setContenido('')
      setEnlace('')
      setTiempo('')
      setTipo('')
      setOpen(false)
    } else {
      Swal.fire('Complete todos los campos', '', 'warning')
    }
  }

  useEffect(() => {
    setContenido('')
    setTiempo('')
    setEnlace('')
  }, [tipo])

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
              Agregar item
            </h2>
            <select
              name=""
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value)
              }}
              id=""
              className="border text-white border-black w-full mx-auto  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
            >
              <option value="">Seleccionar tipo</option>
              <option value="Clase">Clase</option>
              <option value="Tarea">Tarea</option>
              <option value="Examen">Examen</option>
            </select>
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
                <div className="flex w-full items-center gap-6">
                  <input
                    className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    type="text"
                    placeholder="Nombre de la tarea"
                    id="textI"
                    value={contenido}
                    onChange={(e) => {
                      setContenido(e.target.value)
                    }}
                  />
                  <input
                    className="border text-white border-black w-1/2 placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                    type="text"
                    placeholder="Duracion"
                    id="tiempoI"
                    value={tiempo}
                    onChange={(e) => {
                      setTiempo(e.target.value)
                    }}
                  />
                </div>
                <div className="flex w-full flex-col items-center text-white mt-6">
                  <Editor2 content={enlace} setContent={setEnlace} />
                </div>
              </>
                  )
                : tipo == 'Examen'
                  ? (
                    <>
                        <div className="flex w-full items-center gap-6">
                        <select
                            name=""
                            id=""
                            value={tiempo}
                            onChange={(e) => {
                              setTiempo(e.target.value)
                            }}
                            className="text-white border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                        >
                            <option value="">Seleccionar examen</option>
                            {examenes.map(
                              (examen: { id: number, titulo: string }, index) => (
                                <option
                                value={JSON.stringify(examen)}
                                className=""
                                key={index}
                                >
                                {examen.titulo}
                                </option>
                              )
                            )}
                        </select>
                        </div>
                    </>
                    )
                  : null}
            <button
              type="button"
              onClick={() => {
                agregarNuevoItem()
              }}
              className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex mt-10 mx-auto items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Agregar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
