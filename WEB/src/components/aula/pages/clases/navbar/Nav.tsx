import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import {
  type contenidosValues,
  type productosValues
} from '../../../../shared/Interfaces'
import { Global } from '../../../../../helper/Global'
import { motion, AnimatePresence } from 'framer-motion'
import { PiFlagPennantFill } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

interface valuesProps {
  curso: productosValues
  contenidos: contenidosValues[]
  cursoId: string | undefined
  claseId: string | undefined
  setOpenApunte: Dispatch<SetStateAction<boolean>>
  openNav: boolean
  setOpenNav: Dispatch<SetStateAction<boolean>>
  progresoClases: Record<string, Record<string, boolean>>
}

export const Nav = ({ curso, contenidos, cursoId, claseId, setOpenApunte, openNav, setOpenNav, progresoClases }: valuesProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ListadoNumbers = ({
    contenido,
    numeroInicial
  }: {
    contenido: contenidosValues
    numeroInicial: number
  }): JSX.Element => {
    return (
      <>
        <div className="w-full h-[70px] min-h-[70px] bg-transparent flex items-center justify-center relative z-[1] before:h-full  before:w-1 before:absolute before:bg-[#637A9D] before:inset-0 before:mx-auto before:z-[-1] ">
          <span className="rounded-full text-2xl text-secondary-10 bg-[#2C4164] w-8 h-8 flex items-center justify-center ">
            <PiFlagPennantFill />
          </span>
        </div>
        {
          contenido.contenido.map((_conte: any, index: number) => {
            const codClase = contenido.codClases[index] // Accede al elemento correspondiente en 'codClases'
            return (
              <div
                key={index}
                onClick={() => {
                  navigate(`/mis_cursos/curso/clase/${cursoId ?? ''}/tema/${codClase ?? ''}`)
                  setOpen(false)
                  setOpenApunte(false)
                }}
                className={`w-full h-[70px] min-h-[70px]  flex before:h-full items-center justify-center relative z-[1]  before:w-1 before:absolute ${progresoClases[cursoId ?? '']?.[codClase ?? ''] ? 'before:bg-secondary-70' : 'before:bg-[#637A9D]'}  before:inset-0 before:mx-auto before:z-[-1] hover:bg-[#40587c66] transition-colors duration-300 cursor-pointer `}
              >
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className={`rounded-full text-xl text-black/80 ${progresoClases[cursoId ?? '']?.[codClase ?? ''] ? 'bg-secondary-70' : (codClase == claseId ? 'bg-white' : 'bg-[#637A9D]')} w-8 h-8 flex items-center justify-center`}>
                    {numeroInicial + index}
                  </span>
                </div>
              </div>
            )
          })
        }
      </>
    )
  }

  const ListadoTexto = ({
    contenido
  }: {
    contenido: contenidosValues
  }): JSX.Element => {
    return (
      <>
        <div className="w-full h-[70px] min-h-[70px]  bg-transparent p-3 border-b border-secondary-10 flex items-center ">
          <p className="text-white font-bold text-2xl line-clamp-2">
            {contenido.titulo}
          </p>
        </div>
        {contenido.contenido.map((conte: any, index: number) => {
          const codClase = contenido.codClases[index] // Accede al elemento correspondiente en 'codClases'
          return (
            <div
              key={index}
              onClick={() => {
                navigate(`/mis_cursos/curso/clase/${cursoId ?? ''}/tema/${codClase}`)
                setOpen(false)
              }}
              className={`w-full h-[70px] p-3 border-b border-secondary-10 flex items-center  transition-colors duration-300 cursor-pointer ${codClase == claseId ? 'bg-[#40587c]' : 'bg-transparent hover:bg-[#40587c66]'}`}
            >
              <p className="text-gray-300 text-2xl line-clamp-2">{conte}</p>
            </div>
          )
        })}
      </>
    )
  }

  useEffect(() => {
    if (openNav) {
      setOpen(true)
    }
  }, [openNav])

  useEffect(() => {
    if (!open) {
      setOpenNav(false)
    }
  }, [!open])

  return (
    <>
      <div
        className={`${
          !open ? 'w-[32px]' : 'w-[272px]'
        } transition-all duration-300 h-full bg-[#2C4164] overflow-x-hidden overflow-y-scroll scroll_none absolute left-0 z-20 ${openNav ? '' : 'hidden'} lg:flex`}
      >
          <div className="flex flex-col w-[32px] ">
            <span
              className={
                'w-full h-[70px] min-h-[70px] bg-[#35AFFD] flex items-center justify-center '
              }
              onClick={() => {
                setOpen(!open)
              }}
            >
              <FaChevronRight
                className={`text-black text-2xl ${
                  !open ? 'rotate-0' : 'rotate-180'
                } transition-all duration-300`}
              />
            </span>
            {contenidos.map((contenido, index) => {
              let numeroInicial = 1
              for (let i = 0; i < index; i++) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                numeroInicial += contenidos[i].contenido.length
              }
              return (
                <ListadoNumbers
                  key={index}
                  contenido={contenido}
                  numeroInicial={numeroInicial}
                />
              )
            })}
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ width: '0' }}
                animate={{ width: '240px' }}
                exit={{ width: '0' }}
                transition={{ duration: 0.3 }}
                className="w-[240px] h-full bg-[#2C4164] top-0 absolute left-[32px] z-20"
              >
                <section className="flex items-center">
                  <div className="w-full flex flex-col ">
                    <div className="w-full flex gap-3 items-center p-3 border-b border-secondary-10 h-[70px]">
                      <img
                        src={`${Global.urlImages}/productos/${curso.imagen1}`}
                        alt=""
                        className="w-14 h-14 object-cover rounded-full"
                      />
                      <div>
                        <h2 className="text-gray-200 font-semibold text-2xl line-clamp-2">
                          {curso.nombre}
                        </h2>
                      </div>
                    </div>
                    {contenidos.map(
                      (contenido: contenidosValues, index: number) => {
                        return (
                          <ListadoTexto key={index} contenido={contenido} />
                        )
                      }
                    )}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:absolute w-full h-full bg-black/60 z-10 ml-[32px] fondo_scuro"
            onClick={() => {
              setOpen(false)
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
