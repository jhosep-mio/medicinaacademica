import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import { favicon } from '../../../../shared/images'
import { type productosValues } from '../../../../shared/Interfaces'
import { useNavigate } from 'react-router-dom'
import {
  extraerNumeroDesdeURL,
  formatearURL
} from '../../../../shared/funtions/functions'
import { Global } from '../../../../../helper/Global'

interface Props {
  cursos: never[]
  allCursos: productosValues[]
  progresoClases: Record<string, Record<string, boolean>>
}

export const CursosProgreso = (props: Props): JSX.Element => {
  const { cursos, allCursos, progresoClases } = props
  const navigate = useNavigate()

  function limpiarIds (objetoConIds: any): any {
    const nuevoObjeto = {}
    for (const key in objetoConIds) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      nuevoObjeto[extraerNumeroDesdeURL(key)] = objetoConIds[key]
    }
    return nuevoObjeto
  }

  return (
    <Swiper
      pagination={true}
      modules={[Pagination]}
      className="mySwiper py-10"
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
          slidesPerView: 3,
          spaceBetween: 50
        }
      }}
    >
      {(() => {
        const cursoIds = new Set() // Coloca el Set fuera del map para mantener el estado
        const cursosCompletados = cursos.flatMap((curso: any) => {
          if (curso.array_productos) {
            return JSON.parse(curso.array_productos).flatMap((pro: any) => {
              if (!cursoIds.has(pro.id)) {
                cursoIds.add(pro.id)
                const cursoCompleto = allCursos.find((c) => c.id == pro.id)
                if (cursoCompleto != undefined) {
                  const progresoClasesJSON = JSON.parse(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    progresoClases.progreso
                  )
                  const progresoClasesLimpias = limpiarIds(progresoClasesJSON)
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  const progresoCurso =
                    progresoClasesLimpias[cursoCompleto.id ?? '']

                  if (progresoCurso && progresoCurso != undefined) {
                    const clasesConProgreso = JSON.parse(cursoCompleto.contenido).map((clase: any) =>
                      clase.codClases.filter((claseId: any) => progresoCurso[claseId])
                    )
                    const todasLasClases = [].concat(...clasesConProgreso)
                    const totalprogreso = todasLasClases.length
                    const totalcurso = (JSON.parse(cursoCompleto.contenido).flatMap((item: any) => item.codClases || []))
                    const lentotalcurso = totalcurso.length
                    const porcentajeAvance = (totalprogreso / lentotalcurso) * 100
                    if (porcentajeAvance < 100) {
                      return (
                         <SwiperSlide
                           key={cursoCompleto.id}
                           onClick={() => {
                             navigate(
                               `/mis_cursos/curso/${
                                 cursoCompleto.id
                               }-${formatearURL(cursoCompleto.nombre)}`
                             )
                           }}
                           className="rounded-xl relative overflow-hidden shadow-md  transition-all cursor-pointer hover:-translate-y-2"
                         >
                           <div className="w-full h-2 absolute top-0 left-0 right-0">
                             <span
                               className="h-full bg-yellow-400 block absolute inset-0 z-10"
                               style={{ width: `${Number(porcentajeAvance)}%` }}
                             ></span>
                             <span className="w-full h-full bg-gray-400 block"></span>
                           </div>
                           <img
                             className="w-full h-[200px] object-cover"
                             src={`${Global.urlImages}/productos/${cursoCompleto.imagen1}`}
                           />
                           <div className="cart_curses bg-secondary-100 py-6 px-8 flex z-10 relative before:absolute before:bottom-full before:w-full before:h-[15rem] before:left-0 before:right-0 before:z-[-1]">
                             <div className=" flex-1">
                               <p className="line-clamp-1 text-[1.7rem] text-[#b7b7b7]">
                                 Curso de Aprendizaje en linea
                               </p>
                               <p className="line-clamp-1 text-3xl text-white">
                                 Te damos la bienvenida al curso
                               </p>
                             </div>
                             <div className="border border-white rounded-full">
                               <img
                                 src={favicon}
                                 alt=""
                                 className="m-auto w-20 h-20 object-contain"
                               />
                             </div>
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
        // Mostrar mensaje si no hay cursos en progreso
        if (cursosCompletados.length == 0) {
          return (
            <div className="pt-10 w-full">
              <p className="text-4xl text-gray-400 w-full text-center">
                No tienes cursos en progreso
              </p>
            </div>
          )
        }
        return cursosCompletados
      })()}
    </Swiper>
  )
}
