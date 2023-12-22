import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import {
  RiArrowRightSLine,
  RiBookmark2Line,
  RiFolderZipLine
} from 'react-icons/ri'
import { defaultperfil } from '../../../../shared/images'
import {
  type productosValues,
  type apuntesValues
} from '../../../../shared/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { formatearURL } from '../../../../shared/funtions/functions'
import { Fragment } from 'react'

interface valuesProps {
  proyectos: apuntesValues[]
  allCursos: productosValues[]
}

export const Proyectos = ({
  proyectos,
  allCursos
}: valuesProps): JSX.Element => {
  const { auth } = useAuth()
  const navigate = useNavigate()
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
          slidesPerView: 4,
          spaceBetween: 30
        }
      }}
    >
      {allCursos.map((curso, indexCurso: number) => {
        const contenidoCurso = JSON.parse(curso.contenido)
        const tieneContenido = contenidoCurso.some((conten: any) =>
          conten.codClases.some((cod: any) =>
            proyectos.some(
              (apunte: any) =>
                apunte.archivos &&
                JSON.parse(apunte.archivos).some(
                  (archivo: any) => archivo.clase === cod
                )
            )
          )
        )

        if (tieneContenido) {
          return (
            <div key={indexCurso} className="flex flex-col gap-10 mb-10">
              {contenidoCurso.map((conten: any) =>
                conten.codClases.map((cod: any) =>
                  proyectos.map((apunte, index: number) => {
                    const archivosFiltrados =
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      apunte.archivos &&
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      JSON.parse(apunte.archivos).filter(
                        (archivo: any) => archivo.clase === cod
                      )
                    if (archivosFiltrados && archivosFiltrados.length > 0) {
                      return (
                        <Fragment key={index}>
                          {archivosFiltrados.filter((archivo: any) => archivo.user == auth.id).map(
                            (archivo: any, indexa: number) => {
                              const indiceCodClases =
                                conten.codClases.findIndex(
                                  (clase: any) => clase == archivo.clase
                                )
                              return (
                                <SwiperSlide
                                  className="rounded-xl overflow-hidden shadow-md"
                                  key={indexa}
                                >
                                  <div className="bg-white rounded-3xl p-2 shadow-xl">
                                    <div className="flex flex-row items-center gap-4 mb-6 p-4">
                                      <div className="bg-primary/20 flex items-center justify-center rounded-full w-20 h-20 min-w-[5rem]">
                                        <RiFolderZipLine className="text-3xl text-primary" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-primary text-2xl">
                                          {curso.nombre}
                                        </h3>
                                      </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between gap-8 mb-2 px-4">
                                      <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                                        <div className="w-12 h-12 relative flex items-center">
                                          <img
                                            src={defaultperfil}
                                            alt="Hombre"
                                            loading="lazy"
                                            className="rounded-full object-cover m-auto"
                                          />
                                        </div>
                                        <h5 className="text-neutral-500 ">
                                          {auth.name}
                                        </h5>
                                      </div>
                                      <div className="flex flex-col md:flex-row items-center gap-2 text-neutral-600 w-full justify-end">
                                        <RiBookmark2Line />
                                        <h5>
                                          {conten.contenido[indiceCodClases]}
                                        </h5>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
                                      <button
                                        onClick={() => {
                                          navigate(
                                            `/mis_cursos/curso/clase/${
                                              curso.id
                                            }-${formatearURL(
                                              curso.nombre
                                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                            )}/tema/${archivo.clase}`
                                          )
                                        }}
                                        type="button"
                                        className="flex items-center text-[1.3rem] mt-1 p-2 text-black rounded-lg hover:bg-white transition-colors duration-300"
                                      >
                                        Ver proyecto <RiArrowRightSLine />
                                      </button>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              )
                            }
                          )}
                        </Fragment>
                      )
                    } else {
                      return null // No hay archivos para este código de clase
                    }
                  })
                )
              )}
            </div>
          )
        } else {
          return null
        }
      })}
    </Swiper>
  )
}
