import axios from 'axios'
import {
  type valuesSecciones,
  type contenidosValues,
  type productosValues,
  type archivoValuess
} from '../../../shared/Interfaces'
import { useState, useEffect } from 'react'
import { Global } from '../../../../helper/Global'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { MdOutlineAddCircleOutline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { AgregarSeccion } from './modals/AgregarSeccion'
import { AgregarArchivos } from './modals/AgregarArchivos'
import { MostrarContenido } from './modals/MostrarContenido'
import { FaRegFileArchive } from 'react-icons/fa'
import { formatearNombreArchivo } from '../../../shared/funtions/formatearNombreArchivo'

export const Seguimiento = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const [openContenido, setOpenContenido] = useState(false)
  const [contenido, setContenido] = useState('')
  const [openSeccion, setOpenSeccion] = useState(false)
  const [openArchivo, setOpenArchivo] = useState(false)
  const [IdClase, setIdClase] = useState('')
  const [IdSeccion, setIdSeccion] = useState<string | undefined>('')
  const [contenidos, setContenidos] = useState<contenidosValues[]>([])
  const [curso, setCurso] = useState<productosValues>({
    id: 0,
    codigo: '',
    id_categoria: '',
    contenido: '',
    categoria: '',
    id_subcategoria: '',
    id_marca: '',
    nombre: '',
    stock: '',
    imagen1: '',
    imagen2: '',
    imagen3: '',
    imagen4: '',
    imagen5: '',
    imagen6: '',
    precio1: '',
    precio2: '',
    created_at: '',
    updated_at: ''
  })
  const [open, setOpen] = useState('')
  const [secciones, setSecciones] = useState<valuesSecciones[]>([])

  const getOneData = async (): Promise<void> => {
    const token = localStorage.getItem('token')
    const request = await axios.get(`${Global.url}/showAdmin/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
      }
    })
    const responseData: productosValues = request.data[0]
    setCurso(responseData)
    setContenidos(JSON.parse(request.data[0].contenido))
    if (request.data[0].recursos) {
      setSecciones(JSON.parse(request.data[0].recursos))
    } else {
      setSecciones([])
    }
  }

  useEffect(() => {
    setTitle('RECURSOS')
    getOneData()
  }, [])

  const ListadoTexto = ({
    contenido
  }: {
    contenido: contenidosValues
  }): JSX.Element => {
    return (
      <>
        <section className="py-4">
          <div className="w-full h-[70px] min-h-[70px]  bg-transparent p-3 border-b border-secondary-10 flex items-center ">
            <p className="text-white font-bold text-2xl line-clamp-2">
              {contenido.titulo}
            </p>
          </div>
          {contenido.contenido?.map((conte: any, index: number) => {
            let codClase = ''
            if (Array.isArray(contenido.codClases)) {
              codClase = contenido.codClases[index]
              return (
                <>
                  <div
                    key={index}
                    className={`w-full  h-[70px] p-3 border-b border-secondary-10 flex items-center  transition-colors duration-300 cursor-pointer ${
                      codClase == id
                        ? 'bg-[#40587c]'
                        : 'bg-transparent hover:bg-[#40587c66]'
                    }`}
                    onClick={() => {
                      if (codClase == open) {
                        setOpen('')
                      } else {
                        setOpen(codClase)
                      }
                    }}
                  >
                    <div className="w-full flex justify-between gap-4 relative">
                      <p className="text-gray-300 text-2xl line-clamp-2">
                        {conte}
                      </p>
                      {
                        contenido.tipos[index] == 'Clase'
                          ? <Link
                        to={`comentarios/${codClase}`}
                        className="text-black px-4 block h-fit py-2 my-auto  rounded-xl bg-secondary-70 absolute right-3 top-0 bottom-0 hover: hover:bg-secondary-70/80"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        Comentarios
                      </Link>
                          : contenido.tipos[index] == 'Tarea' && <Link
                        to={`archivos/${codClase}`}
                        className="text-black px-4 block h-fit py-2 my-auto  rounded-xl bg-secondary-70 absolute right-3 top-0 bottom-0 hover: hover:bg-secondary-70/80"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        Archivos
                      </Link>
                      }
                    </div>
                  </div>
                  <AnimatePresence>
                    {open == codClase && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-6 px-10"
                      >
                        <div className="mb-10">
                          <button
                            type="button"
                            className="bg-green-600 py-1 px-2 rounded-xl text-black cursor-pointer"
                            onClick={() => {
                              setOpenSeccion(true)
                              setIdClase(codClase)
                            }}
                          >
                            Agregar seccion
                          </button>
                        </div>
                        {secciones && secciones.length > 0 && (
                          <Swiper
                            navigation={true}
                            modules={[Navigation]}
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
                                slidesPerView: 4,
                                spaceBetween: 10
                              }
                            }}
                          >
                            {secciones
                              .filter((seccion) => seccion.idClase == codClase)
                              .map((seccion, index: number) => (
                                <SwiperSlide key={index}>
                                  <div className="flex gap-4 items-center justify-center">
                                    <h2 className="text-xl font-bold">
                                      {seccion.tituloSeccion}
                                    </h2>
                                    <MdOutlineAddCircleOutline
                                      className="text-2xl cursor-pointer"
                                      onClick={() => {
                                        setOpenArchivo(true)
                                        setIdSeccion(seccion.id)
                                      }}
                                    />
                                  </div>
                                  {seccion.archivos &&
                                    seccion.archivos.length > 0 && (
                                      <div className="px-8 py-2 flex flex-col gap-4 mt-8">
                                        {seccion.archivos.map(
                                          (archivo: archivoValuess) => (
                                            <div
                                              className="w-full flex gap-4 items-center text-xl justify-center "
                                              key={archivo.id}
                                            >
                                              {archivo.tipo == 'texto'
                                                ? (
                                                <>
                                                  <div
                                                    className="w-1/2 group cursor-pointer relative"
                                                    onClick={() => {
                                                      setOpenContenido(true)
                                                      setContenido(
                                                        archivo.contenido
                                                      )
                                                    }}
                                                  >
                                                    <div
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          archivo.contenido
                                                      }}
                                                      className="line-clamp-1 w-full group-hover:opacity-0 transition-opacity"
                                                    />
                                                    <p className="absolute inset-0 text-white opacity-0 group-hover:opacity-100 text-left transition-opacity">
                                                      Ver contenido
                                                    </p>
                                                  </div>
                                                  <AiTwotoneDelete className="text-red-500 cursor-pointer mt-1" />
                                                </>
                                                  )
                                                : (
                                                <div className="flex gap-3 w-full justify-center group ">
                                                  <div className="w-1/2 group cursor-pointer relative flex gap-3 items-center">
                                                    <FaRegFileArchive className="inline-block group-hover:opacity-0 transition-opacity" />
                                                    <p className="w-full line-clamp-1 group-hover:opacity-0 transition-opacity">
                                                      {formatearNombreArchivo(
                                                        archivo.contenido
                                                      )}
                                                    </p>
                                                    <p className="absolute inset-0 text-white opacity-0 group-hover:opacity-100 text-left transition-opacity">
                                                      Descargar
                                                    </p>
                                                  </div>
                                                  <AiTwotoneDelete className="text-red-500 cursor-pointer mt-1" />
                                                </div>
                                                  )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                  )}
                                </SwiperSlide>
                              ))}
                          </Swiper>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )
            } else {
              return null
            }
          })}
        </section>
      </>
    )
  }

  return (
    <>
      <h1 className="text-center text-3xl uppercase text-secondary-70 border-b w-fit mx-auto py-2 border-secondary-70">
        {curso.nombre}
      </h1>
      {contenidos?.map((contenido: contenidosValues, index: number) => {
        return <ListadoTexto key={index} contenido={contenido} />
      })}
      <AgregarSeccion
        open={openSeccion}
        setOpen={setOpenSeccion}
        setSecciones={setSecciones}
        idClase={IdClase}
        idCurso={id}
        getOneData={getOneData}
      />
      <AgregarArchivos
        open={openArchivo}
        setOpen={setOpenArchivo}
        secciones={secciones}
        IdSeccion={IdSeccion}
        setSecciones={setSecciones}
        idClase={IdClase}
        idCurso={id}
        getOneData={getOneData}
      />
      <MostrarContenido
        open={openContenido}
        setOpen={setOpenContenido}
        contenido={contenido}
      />
    </>
  )
}
