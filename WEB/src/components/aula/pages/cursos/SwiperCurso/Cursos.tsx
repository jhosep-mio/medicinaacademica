import { Fragment, useEffect, useState } from 'react'
import { getData } from '../../../../shared/FechData'
import {
  type categoriasValues,
  type productosValues
} from '../../../../shared/Interfaces'
import { CardCurso } from './CardCurso'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Global } from '../../../../../helper/Global'
import { Skeleton, Stack } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { formatearURL } from '../../../../shared/funtions/functions'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import imagecurso from './../../../../../assets/cursos/curso.svg'

export const Cursos = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [cursos, setCursos] = useState([])
  const [categorias, setCategorias] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('tokenUser')
  const [allCursos, setAllCursos] = useState<productosValues[]>([])
  const { auth } = useAuth()

  useEffect(() => {
    if (auth.id) {
      window.scrollTo(0, 0)
      Promise.all([
        getData('allCategorias', setCategorias),
        getAllCursos(),
        getcursos()
      ]).then(() => {
        setLoading(false)
      })
    }
  }, [auth.id])

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className}">${index + 1}</span>`
    }
  }

  const getcursos = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/cursesToCompras2/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setCursos(request.data)
  }

  const getAllCursos = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/allProductos`)
      setAllCursos(request.data)
    } catch (error) {
    }
  }

  return (
    <>
      {!loading
        ? (
            <>
            {cursos.length > 0
              ? categorias.filter((categoria: categoriasValues) =>
                cursos.some((curso: any) =>
                  JSON.parse(curso.array_productos).some((pro: any) => {
                    const cursoCompleto = allCursos.find(c => c.id == pro.id)
                    return cursoCompleto && cursoCompleto.id_categoria == String(categoria.id)
                  })
                )
              ).map((categoria: categoriasValues) => (
            <Fragment key={categoria.id}>
              <div className="flex gap-3 w-full text-center items-center ">
                <span className="w-full h-[0.1px] bg-[#24385b]"></span>
                <span className="w-auto px-6 border border-[#24385b] py-3 pr-10 text-gray-300 rounded-2xl flex-shrink-0 uppercase text-2xl flex items-center gap-3">
                  <img
                    src={`${Global.urlImages}/categorias/${categoria.imagen1}`}
                    alt=""
                    className="m-auto w-12 h-12 object-contain bg-gray-300 rounded-full p-2"
                  />
                  {categoria.nombre}
                </span>
                <span className="w-full h-[0.5px] bg-[#24385b]"></span>
              </div>
              <Swiper
                pagination={pagination}
                modules={[Pagination]}
                className="w-full py-10 swiper_cursos min-h-[322px] h-[322px]"
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 40
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 40
                  }
                }}
              >
                {(() => {
                  const cursoIds = new Set() // Coloca el Set fuera del map para mantener el estado
                  return cursos.flatMap((curso: any) => {
                    if (curso.array_productos) {
                      return JSON.parse(curso.array_productos).flatMap(
                        (pro: any) => {
                          if (!cursoIds.has(pro.id)) {
                            cursoIds.add(pro.id)
                            const cursoCompleto = allCursos.filter((curso: productosValues) => curso.id_categoria == String(categoria.id)).find(c => c.id == pro.id)
                            if (cursoCompleto != undefined) {
                              return (
                                    <SwiperSlide
                                        key={cursoCompleto.id}
                                        className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]"
                                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                        onClick={() => { navigate(`curso/${cursoCompleto.id}-${formatearURL(cursoCompleto.nombre)}`) }}
                                        >
                                        <CardCurso curso={cursoCompleto} />
                                    </SwiperSlide>
                              )
                            }
                            return []
                          }
                          return []
                        }
                      )
                    }
                    return []
                  })
                })()}

                {/* {cursos
                  .filter(
                    (curso: productosValues) =>
                      curso.id_categoria == String(categoria.id)
                  )
                  .map((curso: productosValues) => {
                    return (
                    <SwiperSlide
                      key={curso.id}
                      className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]"
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      onClick={() => { navigate(`curso/${curso.id}-${formatearURL(curso.nombre)}`) }}
                    >
                      <CardCurso curso={curso} />
                    </SwiperSlide>
                    )
                  })} */}
              </Swiper>
            </Fragment>
              ))
              : <div className='mt-10 flex gap-10 flex-col justify-center items-center w-full h-full'>
                    <div className='w-[500px] h-[400px]'>
                        <img src={imagecurso} alt="" className='w-full h-full object-contain '
                        />
                    </div>
                    <h2 className="text-gray-400 font-semibold text-4xl w-full text-center">
                        Aún no estás inscrito en ningun curso
                    </h2>
                    <Link to='/formacionacademica' className='text-3xl px-6 py-4 bg-secondary-200 text-black/80 rounded-xl font-bold hover:text-black/80
                    hover:bg-secondary-200/70 transition-colors'>
                        Comprar cursos
                    </Link>
                </div>}
            </>
          )
        : (
        <>
          <div className="flex gap-3 w-full text-center items-center ">
            <span className="w-full h-[0.1px] bg-[#24385b]"></span>
            <Stack spacing={1} className="w-[500px] h-[47px] rounded-xl">
              <Skeleton
                animation="wave"
                variant="rectangular"
                className="w-full h-full object-cover rounded-xl"
              />
            </Stack>
            <span className="w-full h-[0.5px] bg-[#24385b]"></span>
          </div>
          <section className="w-full py-10 swiper_cursos min-h-[322px] h-[322px] grid grid-cols-4 gap-[30px]">
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
          </section>
          <div className="flex gap-3 w-full text-center items-center ">
            <span className="w-full h-[0.1px] bg-[#24385b]"></span>
            <Stack spacing={1} className="w-[500px] h-[47px] rounded-xl">
              <Skeleton
                animation="wave"
                variant="rectangular"
                className="w-full h-full object-cover rounded-xl"
              />
            </Stack>
            <span className="w-full h-[0.5px] bg-[#24385b]"></span>
          </div>
          <section className="w-full py-10 swiper_cursos min-h-[322px] h-[322px] grid grid-cols-4 gap-[30px]">
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
            <div className="cursor-pointer group hover:-translate-y-2 transition-transform duration-300 shadow_curso hover:shadow-black min-h-[273px]">
              <Stack spacing={1} className="w-full h-[273px] rounded-xl">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  className="w-full h-full object-cover rounded-xl"
                />
              </Stack>
            </div>
          </section>
        </>
          )}
    </>
  )
}
