import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { IoLayers } from 'react-icons/io5'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { type productosValues } from '../../../../shared/Interfaces'
import { useNavigate } from 'react-router-dom'
import { extraerNumeroDesdeURL, formatearURL } from '../../../../shared/funtions/functions'
import { Global } from '../../../../../helper/Global'
import { useEffect, useState } from 'react'

interface Props {
  ticket: string | undefined
  totalTickets: string | undefined
  cursos: never[]
  allCursos: productosValues[]
  progresoClases: Record<string, Record<string, boolean>>
}

const CursosCompletados = (props: Props): JSX.Element => {
  const { ticket, cursos, allCursos, progresoClases } = props
  const navigate = useNavigate()
  let status = ''
  let textColor = ''
  const [cursosCompletadosCount, setCursosCompletadosCount] = useState(0)

  switch (ticket) {
    case 'pending':
      status = 'bg-white/70 text-[#2a405d]'
      textColor = 'text-gray-300'
      break
    case 'inProcess':
      status = 'bg-blue-500/10 text-blue-500'
      textColor = 'text-blue-500'
      break
    case 'close':
      status = 'bg-green-500/10 text-green-500'
      textColor = 'text-green-500'
      break
    case 'total':
      status = 'bg-pink-500/10 text-pink-500'
      textColor = 'text-pink-500'
      break
  }

  function limpiarIds (objetoConIds: any): any {
    const nuevoObjeto = {}
    for (const key in objetoConIds) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      nuevoObjeto[extraerNumeroDesdeURL(key)] = objetoConIds[key]
    }
    return nuevoObjeto
  }

  useEffect(() => {
    // Contar cursos completados al inicio
    contarCursosCompletados()
  }, [cursos, allCursos, progresoClases])

  const contarCursosCompletados = (): void => {
    const cursoIds = new Set()
    let count = 0

    cursos.forEach((curso) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (curso.array_productos) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
        JSON.parse(curso.array_productos).forEach((pro) => {
          if (!cursoIds.has(pro.id)) {
            cursoIds.add(pro.id)
            const cursoCompleto = allCursos.find((c) => c.id === pro.id)

            if (cursoCompleto) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              const progresoClasesJSON = JSON.parse(progresoClases.progreso)
              const progresoClasesLimpias = limpiarIds(progresoClasesJSON)
              const progresoCurso = progresoClasesLimpias[cursoCompleto.id ?? '']
              if (progresoCurso) {
                const clasesConProgreso = JSON.parse(cursoCompleto.contenido).map((clase: any) => clase.codClases.filter(
                  (claseId: any) => progresoCurso[claseId]
                ))
                // Flatten the array of arrays into a single array
                const todasLasClasesConProgreso = [].concat(...clasesConProgreso)
                const totalprogreso = todasLasClasesConProgreso.length
                // TOTALES
                const totalcurso = (JSON.parse(cursoCompleto.contenido).flatMap((item: any) => item.codClases || []))
                const lentotalcurso = totalcurso.length
                const porcentajeAvance = (totalprogreso / lentotalcurso) * 100
                if (porcentajeAvance == 100) {
                  count += 1
                }
              }
            }
          }
        })
      }
    })
    setCursosCompletadosCount(count)
  }

  return (
    <div className="bg-[#2a405d] hover:bg-[#304560] transition-all  hover:scale-105 hover:rotate-1 p-12 rounded-xl">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex gap-6 items-center">
          <IoLayers
            className={`text-4xl lg:text-5xl ${status} p-6 box-content rounded-full text-green-700`}
          />
          <h1 className="text-3xl lg:text-4xl text-white font-bold">
            Cursos Completados
          </h1>
        </div>
      </div>
      {/* Number of tickets */}
      <div className="mt-10">
        <p className={`${textColor} text-4xl lg:text-5xl text-left  w-fit`}>
          {cursosCompletadosCount} curso(s) completados
        </p>
      </div>
      <hr className="border border-dashed border-green-700 mt-8 mb-6" />
      <Swiper
        className="mySwiper min-h-[72px]"
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 20
          }
        }}
      >
        {(() => {
          const cursoIds = new Set() // Coloca el Set fuera del map para mantener el estado
          return cursos.flatMap((curso: any) => {
            if (curso.array_productos) {
              return JSON.parse(curso.array_productos).flatMap((pro: any) => {
                if (!cursoIds.has(pro.id)) {
                  cursoIds.add(pro.id)
                  const cursoCompleto = allCursos.find((c) => c.id == pro.id)
                  if (cursoCompleto != undefined) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const progresoClasesJSON = JSON.parse(progresoClases.progreso)
                    const progresoClasesLimpias = limpiarIds(progresoClasesJSON)
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    const progresoCurso = (progresoClasesLimpias[cursoCompleto.id ?? ''])
                    if (progresoCurso != undefined && progresoCurso) {
                      const clasesConProgreso = JSON.parse(cursoCompleto.contenido).map((clase: any) => clase.codClases.filter(
                        (claseId: any) => progresoCurso[claseId]
                      ))
                      // Flatten the array of arrays into a single array
                      const todasLasClasesConProgreso = [].concat(...clasesConProgreso)
                      const totalprogreso = todasLasClasesConProgreso.length
                      // TOTALES
                      const totalcurso = (JSON.parse(cursoCompleto.contenido).flatMap((item: any) => item.codClases || []))
                      const lentotalcurso = totalcurso.length
                      const porcentajeAvance = (totalprogreso / lentotalcurso) * 100
                      if (porcentajeAvance == 100) {
                        return (
                            <SwiperSlide
                              key={cursoCompleto.id}
                              className='cursor-pointer'
                              onClick={() => {
                                navigate(
                                  `/mis_cursos/curso/${
                                    cursoCompleto.id
                                  }-${formatearURL(cursoCompleto.nombre)}`
                                )
                              }}
                            >
                              <div className="flex items-center justify-center  rounded-full w-28 h-28 mx-auto">
                                <img
                                  className="w-full h-full p-3 object-cover rounded-full"
                                  src={`${Global.urlImages}/productos/${cursoCompleto.imagen1}`}
                                />
                              </div>
                            </SwiperSlide>
                        )
                      }
                    }
                  }
                  return []
                }
                return []
              })
            }
            return []
          })
        })()}
      </Swiper>
      <div className="w-full grid grid-cols-5 justify-center items-center"></div>
    </div>
  )
}

export default CursosCompletados
