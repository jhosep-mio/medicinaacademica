import useAuth from '../../../../hooks/useAuth'
import { NavBarLeft } from '../clases/navbar/NavBarLeft'
import { MenuPerfill } from '../clases/navbar/MenuPerfill'
import { Header } from '../../../public/estructura/Header'
import { useEffect, useState } from 'react'
import {
  type productosValues,
  type apuntesValues
} from '../../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../../helper/Global'

export const MisApuntes = (): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [apuntes, setApuntes] = useState<apuntesValues[]>([])
  const tokenUser = localStorage.getItem('tokenUser')
  const [allCursos, setAllCursos] = useState<productosValues[]>([])

  const getApuntes = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getApuntes/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    setApuntes(request.data[0].apuntes ? JSON.parse(request.data[0].apuntes) : [])
  }

  const getAllCursos = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/allProductos`)
      setAllCursos(request.data)
    } catch (error) {}
  }

  useEffect(() => {
    if (auth.id) {
      getApuntes()
      getAllCursos()
    }
  }, [auth.id])

  function extraerNumeroDesdeURL (url: string): string | null {
    const match = url.match(/\d+/) // Encuentra una secuencia de uno o más dígitos
    return match ? match[0] : null // Devuelve el primer número encontrado o null si no hay ningún número
  }

  return (
    <>
      <NavBarLeft open={open} />
      <div className="md:hidden">
        <Header />
      </div>
      <MenuPerfill />
      <section className="bg-primary py-20  font_baloo lg:pl-[280px] min-h-screen">
        <div className="w-full max-w-[1450px] px-6 lg:px-20 mx-auto">
          <section className="flex flex-col gap-10 mb-20">
            <h1 className="text-white font-semibold text-5xl w-full text-center">
              MIS APUNTES
            </h1>
            <p className="text-gray-300 text-2xl w-full px-6 lg:px-0 lg:w-[60%] mx-auto text-center">
              ¡Bienvenido, {auth.name}!. Esta es tu área personal donde podrás
              acceder a todos los apuntes realizados en los diferentes cursos
              que haz llevado durante tu aprendizaje.
            </p>
          </section>
        </div>
        <section className="w-[80%] mx-auto f">
        {allCursos
          .filter((curso) =>
            apuntes.some((apunte) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
              extraerNumeroDesdeURL(apunte.cursoId) === String(curso.id))
          ).map((curso, indexCurso: number) => (
            <div key={indexCurso} className='flex flex-col gap-10 mb-10'>
              <h1 className='text-4xl font-bold'>{curso.nombre}</h1>
                {apuntes?.filter((apunte) =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                  extraerNumeroDesdeURL(apunte.cursoId) == String(curso.id)).map((apunte, index: number) => (
                  <div
                    key={index}
                    className="bg-[#24385b] rounded-xl w-full h-fit flex gap-3 items-start hover:bg-[#24385b80] transition-colors cursor-pointer relative"
                  >
                    <div className="cursor-pointer flex items-start w-[96%] h-fit p-6">
                      <span className="text-secondary-70 font-bold w-fit py-4">
                        {apunte.tiempo} -
                      </span>
                      <p
                        placeholder="Escribir apunte"
                        className="w-full flex-1 h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-2xl break-words"
                      >
                        {apunte.texto}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          ))}
        </section>
      </section>

      <button
        id=""
        className="fixed right-6 bottom-6 rounded-full bg-white w-16 h-16 z-20 md:hidden"
        onClick={() => {
          setOpen(!open)
        }}
      >
        <span className="fa fa-bars text-primary text-[2.4rem] "></span>
      </button>
    </>
  )
}
