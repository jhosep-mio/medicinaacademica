import useAuth from '../../../../hooks/useAuth'
import { Cursos } from './SwiperCurso/Cursos'
import { NavBarLeft } from '../clases/navbar/NavBarLeft'
import { MenuPerfill } from '../clases/navbar/MenuPerfill'
import { Header } from '../../../public/estructura/Header'
import { useState } from 'react'

export const MisCursos = (): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <NavBarLeft open={open}/>
      <div className="md:hidden">
        <Header />
      </div>
      <MenuPerfill/>
      <section className="bg-primary py-20  font_baloo lg:pl-[280px] min-h-screen">
        <div className="w-full max-w-[1450px] px-6 lg:px-20 mx-auto">
          <section className="flex flex-col gap-10 mb-20">
            <h1 className="text-white font-semibold text-5xl w-full text-center">
              MIS CURSOS
            </h1>
            <p className="text-gray-300 text-2xl w-full px-6 lg:px-0 lg:w-[60%] mx-auto text-center">
              ¡Bienvenido, {auth.name}!. Esta es tu área personal donde podrás
              acceder a todos los cursos que has seleccionado para tu
              aprendizaje. Estamos emocionados de acompañarte en este viaje de
              conocimiento y desarrollo. A continuación, encontrarás la lista de
              los cursos que has comprado.
            </p>
          </section>
          <section className="flex gap-10 flex-col min-h-[322px]">
            <Cursos />
          </section>
        </div>
      </section>

      <button id="" className='fixed right-6 bottom-6 rounded-full bg-white w-16 h-16 z-20 md:hidden' onClick={() => { setOpen(!open) }}>
        <span className="fa fa-bars text-primary text-[2.4rem] "></span>
      </button>
    </>
  )
}
