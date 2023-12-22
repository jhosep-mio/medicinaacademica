import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { FooterTwo } from '../../../public/estructura/FooterTwo'
import { Header } from '../../../public/estructura/Header'
import { defaultperfil, portada } from '../../../shared/images'
import 'swiper/css'
import 'swiper/css/pagination'
import CardDiplomas from './card/CardDiplomas'
import CursosInscritos from './card/CursosInscritos'
import CursosCompletados from './card/CursosCompletados'
import { Global } from '../../../../helper/Global'
import { useEffect, useState } from 'react'
import { Skeleton } from '@mui/material'
import Stack from '@mui/material/Stack'
import { type apuntesValues, type productosValues } from '../../../shared/Interfaces'
import axios from 'axios'
import Loading from '../../../shared/Loading'
import { CursosProgreso } from './card/CursosProgreso'
import { Proyectos } from './card/Proyectos'

export const Perfil = (): JSX.Element | undefined => {
  const { auth, loading } = useAuth()
  const navigate = useNavigate()
  const [allCursos, setAllCursos] = useState<productosValues[]>([])
  const [progresoClases, setProgresoClases] = useState<
  Record<string, Record<string, boolean>>
  >({})
  const [cursos, setCursos] = useState([])
  const token = localStorage.getItem('tokenUser')
  const [loadingPerfil, setLoadingPerfil] = useState(true)
  const [proyectos, setProyectos] = useState<apuntesValues[]>([])
  const [totalCertificados, setTotalCertificados] = useState(0)

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

  const getProgreso = async (): Promise<void> => {
    // TRAER PROGRESO
    const requestprogreso = await axios.get(
        `${Global.url}/getApuntes/${auth.id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          }
        }
    )
    setProgresoClases(requestprogreso.data[0])
  }

  const getCertificados = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showCertificados/${auth.id}`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ''}`
        }
      }
    )
    setTotalCertificados(request.data.length)
  }

  const getProyectos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getArchivoss`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    setProyectos(request.data)
  }

  useEffect(() => {
    if (!loading && !auth.id) {
      // Cambio a !auth.id para cubrir null, undefined, y ''
      navigate('/', { replace: true })
    }
    if (auth.id) {
      window.scrollTo(0, 0)
      Promise.all([
        getAllCursos(),
        getProgreso(),
        getCertificados(),
        getProyectos(),
        getcursos()
      ]).then(() => {
        setLoadingPerfil(false)
      })
    }
  }, [auth.id, loading])

  const generarNombreDeUsuario = (nombreCompleto: string): string => {
    const partes = nombreCompleto.trim().split(/\s+/) // Dividir por uno o más espacios
    const iniciales = partes.map((nombre) => nombre[0]).join('')
    return `${iniciales.toLowerCase()}`
  }

  return (
    <>
      <Header />
      {loadingPerfil
        ? <Loading/>
        : <section className="bg-primary font_baloo pb-32">
        <div className="w-full h-[300px] relative before:absolute before:w-full before:h-full before:bg-black before:opacity-10 before:inset-0">
          {auth.id
            ? (
            <img
              src={
                auth.portada
                  ? `${Global.urlImages}/fotoportada/${auth.portada}`
                  : portada
              }
              alt=""
              className="w-full h-full object-cover"
            />
              )
            : (
            <Stack spacing={1} className="w-full h-full">
              <Skeleton
                animation="wave"
                variant="rectangular"
                className="w-full h-full object-cover"
              />
            </Stack>
              )}
        </div>
        <div className="container px-10">
          <div className="w-full flex justify-center items-center flex-col">
            {!loading
              ? (
              <img
                src={
                  auth.foto
                    ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                    : defaultperfil
                }
                alt=""
                className="w-96 h-96 -top-52 relative rounded-full drop-shadow-xl"
              />
                )
              : (
              <Stack spacing={1} className="h-96">
                <Skeleton
                  variant="circular"
                  animation="wave"
                  className="w-96 h-96 -top-52 relative rounded-full drop-shadow-xl"
                />
              </Stack>
                )}
            <div className="-top-36 relative flex flex-col ">
              {!loading && auth.name
                ? (
                <>
                  <p className="text-5xl font-bold w-full text-center">
                    {auth.name}
                  </p>
                  <p className="text-3xl text-center mt-6">
                    {generarNombreDeUsuario(auth.name)}
                  </p>
                </>
                  )
                : (
                <Stack spacing={1} className="h-28 w-full">
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    className="h-12 w-full"
                  />
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    className="h-6 w-full"
                  />
                </Stack>
                  )}
              <Link
                to="edit"
                className="bg-secondary-200 text-white px-8 py-4 text-3xl mx-auto mt-8 font-bold"
              >
                Completa tu perfil
              </Link>
            </div>
          </div>
          <div className='py-10 grid grid-cols-1 lg:grid-cols-3 gap-[5.5rem]'>
              <CursosInscritos ticket="pending" totalTickets="10" cursos={cursos} allCursos={allCursos}/>
              <CursosCompletados ticket="pending" totalTickets="10" cursos={cursos} allCursos={allCursos} progresoClases={progresoClases}/>
              <CardDiplomas ticket="pending" totalTickets="10" total={totalCertificados}/>
          </div>
          <section className="w-full mt-20">
            <h2 className="text-5xl font-bold text-gray-300">
              Cursos en progreso
            </h2>
            <CursosProgreso cursos={cursos} allCursos={allCursos} progresoClases={progresoClases}/>
          </section>
          <section className="w-full mt-20">
            <h2 className="text-5xl font-bold text-gray-300">Mis proyectos</h2>
            <Proyectos proyectos={proyectos} allCursos={allCursos}/>
          </section>
        </div>
      </section>
      }
      <FooterTwo />
    </>
  )
}
