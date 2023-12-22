import { Link } from 'react-router-dom'
import { logo_white } from '../../../../shared/images'
import {
  BiSolidBookmarks,
  //   BiSolidCalendarCheck,
  BiSolidNote
} from 'react-icons/bi'
import { FaFolderOpen } from 'react-icons/fa'
import { PiCertificateFill } from 'react-icons/pi'
import { IoIosHelpCircle, IoMdSettings } from 'react-icons/io'

export const NavBarLeft = ({ open }: { open: boolean }): JSX.Element => {
  const currentPath = window.location.pathname

  return (
    <section
      className={`w-[280px] z-[999] fixed left-0 top-0 bottom-0 h-screen bg-[#092344] shadow_nav ${
        open ? 'fixed' : 'hidden'
      } lg:flex justify-between flex-col `}
    >
      <div>
        <Link to="/" className="w-full p-4 block">
          <img
            src={logo_white}
            alt=""
            className="w-[90%] h-[60px] object-contain mx-auto"
          />
        </Link>
        <hr className="my-8 border-gray-600" />
        <div className="">
          <span className="text-gray-300 pb-10 block px-8">MI PANEL</span>
          <ul className="flex flex-col gap-12">
            <li className="px-8 relative">
              { currentPath == '/mis_cursos' && <div className="h-full w-2 bg-secondary-200 absolute left-0 top-0 bottom-0 my-auto group"></div>}
              <Link
                to="/mis_cursos"
                className={`flex gap-3 items-center text-3xl ${
                  currentPath == '/mis_cursos'
                    ? 'text-secondary-200 focus:text-secondary-200'
                    : 'text-gray-500 focus:text-gray-500'
                } hover:text-secondary-200`}
              >
                <BiSolidBookmarks />
                Mis cursos
              </Link>
            </li>
            <li className="px-8 relative">
              { currentPath == '/mis_apuntes' && <div className="h-full w-2 bg-secondary-200 absolute left-0 top-0 bottom-0 my-auto group"></div>}
              <Link
                to="/mis_apuntes"
                className={`flex gap-3 items-center text-3xl ${
                  currentPath == '/mis_apuntes'
                    ? 'text-secondary-200 focus:text-secondary-200'
                    : 'text-gray-500 focus:text-gray-500'
                } hover:text-secondary-200`}
              >
                <BiSolidNote />
                Mis apuntes
              </Link>
            </li>
            <li className="px-8 relative">
            { currentPath == '/mis_proyectos' && <div className="h-full w-2 bg-secondary-200 absolute left-0 top-0 bottom-0 my-auto group"></div>}
              <Link
                to="/mis_proyectos"
                className={`flex gap-3 items-center text-3xl ${
                    currentPath == '/mis_proyectos'
                      ? 'text-secondary-200 focus:text-secondary-200'
                      : 'text-gray-500 focus:text-gray-500'
                  } hover:text-secondary-200`}
              >
                <FaFolderOpen />
                Mis proyectos
              </Link>
            </li>
            <li className="px-8 relative">
                { currentPath == '/mis_constancias' && <div className="h-full w-2 bg-secondary-200 absolute left-0 top-0 bottom-0 my-auto group"></div>}
              <Link
                to="/mis_constancias"
                className={`flex gap-3 items-center text-3xl ${
                    currentPath == '/mis_constancias'
                      ? 'text-secondary-200 focus:text-secondary-200'
                      : 'text-gray-500 focus:text-gray-500'
                  } hover:text-secondary-200`}
              >
                <PiCertificateFill />
                Mis constancias
              </Link>
            </li>
            <li className="px-8 relative">
                { currentPath == '/mis_compras' && <div className="h-full w-2 bg-secondary-200 absolute left-0 top-0 bottom-0 my-auto group"></div>}
              <Link
                to="/mis_compras"
                className={`flex gap-3 items-center text-3xl ${
                    currentPath == '/mis_compras'
                      ? 'text-secondary-200 focus:text-secondary-200'
                      : 'text-gray-500 focus:text-gray-500'
                  } hover:text-secondary-200`}
              >
                <PiCertificateFill />
                Mis compras
              </Link>
            </li>
            {/* <li className="px-8 relative">
              <Link
                to=""
                className="flex gap-3 items-center text-3xl text-gray-500 focus:text-gray-500 hover:text-gray-500"
              >
                <BiSolidCalendarCheck />
                Mi plan de estudio
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="pb-10">
        <hr className="my-12 border-gray-600" />
        <ul className="flex flex-col gap-12">
          <li className="px-8 relative">
            <Link
              to="/perfil/edit"
              className="flex gap-3 items-center text-[1.6rem] text-[#878fb8] focus:text-[#878fb8] hover:text-[#878fb8]"
            >
              <IoMdSettings className="" />
              <span className="block w-auto">Configuración</span>
            </Link>
          </li>
          <li className="px-8 relative">
            <Link
              to="/centrodeayuda"
              className="flex gap-3 items-center text-[1.6rem] text-[#878fb8] focus:text-[#878fb8] hover:text-[#878fb8]"
            >
              <IoIosHelpCircle className="text-3xl" />
              <span className="block w-auto"> ¿Cómo funciona mi panel?</span>
            </Link>
          </li>
          <li className="px-8 relative">
            <Link
              to="/centrodeayuda"
              className="flex gap-3 items-center text-[1.6rem] text-[#878fb8] focus:text-[#878fb8] hover:text-[#878fb8]"
            >
              <IoIosHelpCircle className="text-3xl" />
              <span className="block w-auto"> ¿Cómo subo mi proyecto?</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
