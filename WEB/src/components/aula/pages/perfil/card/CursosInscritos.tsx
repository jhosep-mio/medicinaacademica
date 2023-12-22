import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { IoLayers } from 'react-icons/io5'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { type productosValues } from '../../../../shared/Interfaces'
import { useNavigate } from 'react-router-dom'
import { Global } from '../../../../../helper/Global'

interface Props {
  ticket: string | undefined
  totalTickets: string | undefined
  cursos: never[]
  allCursos: productosValues[]
}

const CursosInscritos = (props: Props): JSX.Element => {
  const { ticket, cursos, allCursos } = props
  const navigate = useNavigate()
  let status = ''
  let textColor = ''

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

  const cursosCompletadosIds = new Set(
    cursos.flatMap((curso: any) =>
      JSON.parse(curso.array_productos).map((pro: any) => String(pro.id))
    )
  )

  const cursosCompletados = allCursos.filter((curso) => cursosCompletadosIds.has(String(curso.id)))

  return (
    <div
      className="bg-[#2a405d] hover:bg-[#304560] transition-all cursor-pointer hover:scale-105 hover:rotate-1 p-12 rounded-xl"
      onClick={() => {
        navigate('/mis_cursos')
      }}
    >
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex gap-6 items-center">
          <IoLayers
            className={`text-3xl lg:text-5xl ${status} p-6 box-content rounded-full`}
          />
          <h1 className="text-3xl lg:text-4xl text-white font-bold">
            Cursos inscritos
          </h1>
        </div>
      </div>
      {/* Number of tickets */}
      <div className="mt-10">
        <p className={`${textColor} text-4xl lg:text-5xl text-left`}>
          {cursosCompletados.length} curso(s) en total
        </p>
      </div>
      <hr className="border border-dashed border-gray-500/50 mt-8 mb-6" />
      <Swiper
        className="mySwiper"
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
                    return (
                      <SwiperSlide key={cursoCompleto.id}>
                        <div className="flex items-center justify-center  rounded-full w-28 h-28 mx-auto">
                          <img
                            className="w-full h-full p-3 object-cover rounded-full"
                            src={`${Global.urlImages}/productos/${cursoCompleto.imagen1}`}
                          />
                        </div>
                      </SwiperSlide>
                    )
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

export default CursosInscritos
