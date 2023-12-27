import { BsFillCartCheckFill } from 'react-icons/bs'
import { defaultperfil, logo_white } from '../../shared/images'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { FaUserNurse, FaFolderOpen } from 'react-icons/fa'
import { BiSearchAlt2, BiSolidBookmarks } from 'react-icons/bi'
import { motion, AnimatePresence } from 'framer-motion'
import { PiCertificateFill } from 'react-icons/pi'
import { IoMdSettings, IoIosHelpCircle, IoIosLogOut } from 'react-icons/io'
import { Global } from '../../../helper/Global'
import axios from 'axios'
import { GiShoppingBag } from 'react-icons/gi'

export const Header = (): JSX.Element => {
  const [menu, setMenu] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputFocus, setInputFocus] = useState(false)
  const [cardUser, setCardUser] = useState(false)
  const [timeoutId, setTimeoutId] = useState<any | null>(null)
  const navigate = useNavigate()
  const handleMenu = (): void => {
    setMenu(!menu)
  }
  const token = localStorage.getItem('tokenUser')
  const [query, setQuery] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const handleInputChange = (event: any): void => {
    const queryLimpio = event.target.value

    const cleanedQuery = queryLimpio.replace(/[^a-zA-Z0-9 ]/g, '')

    setQuery(cleanedQuery)
  }

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = (): void => {
    navigate(`/search/${query}`)
    setQuery('')
  }

  const handleClickOutside = (e: MouseEvent): void => {
    // Cerrar el cuadro de búsqueda si se hace clic fuera de él
    if (
      searchRef.current &&
      inputRef.current &&
      !searchRef.current.contains(e.target as Node) &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setIsSearchVisible(false)
    }
  }

  const handleInputFocus = (): void => {
    setInputFocus(true)
  }

  const toggleSearch = (): void => {
    if (inputFocus) {
      setInputFocus(false)
      setIsSearchVisible(isSearchVisible)
    } else {
      setIsSearchVisible(!isSearchVisible)
    }
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      handleClickOutside(e)
    }

    if (isSearchVisible && inputFocus) {
      setIsSearchVisible(true)
    } else {
      document.addEventListener('mousedown', handleClick)
    }
  }, [isSearchVisible])

  const [scrolled] = useState(false)
  const { cart, auth, setAuth } = useAuth()
  const cerrarSession = async (): Promise<void> => {
    const data = new FormData()
    data.append('_method', 'POST')
    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.setItem('tokenUser', '')
    localStorage.setItem('estudiante', '')
    setAuth({
      id: '',
      name: '',
      email: '',
      idRol: null,
      foto: '',
      onlyname: '',
      lastname: '',
      portada: ''
    })
  }

  return (
    <>
      <header
        className={`${
          scrolled ? 'menuFixed' : ''
        } overflow-x-clip  relative h-[106px]`}
      >
        <nav className="navmain eonav-cntfluid h-full relative">
          <ul className="flex justify-between items-center h-full md:hidden relative">
            <Link
              to="/"
              className="h-full block w-[50%]"
              onClick={() => {
                setMenu(false)
              }}
            >
              <img
                src={logo_white}
                width="100%"
                className="h-full object-contain"
              />
            </Link>
            <li className="">
              <div className="flex gap-8 items-center">
                <button id="" onClick={handleMenu}>
                  <span className="fa fa-bars text-white text-[3.2rem] mt-1"></span>
                </button>
                {auth.id && (
                  <button
                    type="button"
                    className="relative"
                    onClick={() => { setCardUser(!cardUser) }}
                  >
                    <>
                      <img
                        src={
                          auth.foto
                            ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                            : defaultperfil
                        }
                        alt=""
                        className="rounded-full w-16 h-16"
                      />

                      <AnimatePresence>
                        {cardUser && auth.id && (
                          <motion.div
                            initial={{ right: '-200px' }}
                            animate={{ right: '-10px' }}
                            exit={{ right: '-200px' }}
                            transition={{ duration: 0.05 }}
                            className={`cardUserInfo ${
                              cardUser ? 'showCardUser' : ''
                            } overflow-hidden`}
                          >
                            <Link className="cardUserInfo__user" to="/perfil">
                              <div className="cardUserInfo__user__img">
                                <span>
                                  <img
                                    src={
                                      auth.foto
                                        ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                                        : defaultperfil
                                    }
                                    alt=""
                                    className="rounded-full"
                                  />
                                </span>
                              </div>
                              <div className="cardUserInfo__user__info">
                                <h5 className="text-left">{auth.name}</h5>
                                <p>{auth.email}</p>
                              </div>
                            </Link>
                            <div className="cardUserInfo__seccion1">
                              <ul>
                                <li>
                                  <Link to="/perfil">
                                    <FaUserNurse />
                                    Ver perfil
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_cursos">
                                    <BiSolidBookmarks />
                                    Mis cursos
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_proyectos">
                                    <FaFolderOpen />
                                    Mis proyectos
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_constancias">
                                    <PiCertificateFill />
                                    Mis constancias
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_compras">
                                    <GiShoppingBag />
                                    Mis compras
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="cardUserInfo__seccion1">
                              <ul>
                                <li>
                                  <Link to="/perfil/edit">
                                    <IoMdSettings />
                                    Configuración
                                  </Link>
                                </li>
                                <li>
                                  <Link to="">
                                    <IoIosHelpCircle />
                                    Centro de ayuda
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="cardUserInfo__seccion1">
                              <ul>
                                <li
                                  onClick={() => {
                                    cerrarSession()
                                  }}
                                >
                                  <Link to="">
                                    <IoIosLogOut />
                                    Cerrar sesión
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  </button>
                )}
                {/* <Link
                  to="/carrito"
                  className="flex gap-2 relative px-4 h-full mr-4"
                >
                  <BsFillCartCheckFill className="text-white text-5xl" />
                  <span className="absolute -top-3 -right-4 text-black bg-white w-[20px] flex items-center justify-center h-[20px] rounded-full">
                    {cart.length}
                  </span>
                </Link> */}
              </div>
            </li>
          </ul>
          {/* <div className="w-full absolute top-full left-0 right-0 "> */}
          <ul
            className={`nav list_pestañas flex-1 ${
              menu ? 'showMenu' : ''
            } md:hidden`}
          >
            {!auth.id && (
              <li className="li_first text-[13.5px]">
                <Link
                  to="/login"
                  onClick={handleMenu}
                  className="hover:text-gray-300 stiips "
                >
                  INICIAR SESIÓN
                  <span className="hoverline1"></span>
                  <span className="hoverline2"></span>
                  <span className="hoverline3"></span>
                </Link>
              </li>
            )}
            <li className="li_first text-[13.5px]">
              <Link
                to="/carrito"
                onClick={handleMenu}
                className="hover:text-gray-300 stiips"
              >
                CARRITO
                <span className="text-black bg-white w-[20px] flex items-center justify-center h-[20px] rounded-full ">
                  {cart.length}
                </span>
                <span className="hoverline1"></span>
                <span className="hoverline2"></span>
                <span className="hoverline3"></span>
              </Link>
            </li>
            <li className="li_first text-[13.5px]">
              <Link
                to="/formacionacademica"
                onClick={handleMenu}
                className="hover:text-gray-300"
              >
                CURSOS
                <span className="hoverline1"></span>
                <span className="hoverline2"></span>
                <span className="hoverline3"></span>
              </Link>
            </li>
            <li className="li_second"> | </li>
            <li className="li_first text-[13.5px]">
              <Link
                to="/viewservicio/17"
                onClick={handleMenu}
                className="hover:text-gray-300"
              >
                ASESORIA DE TESIS
                <span className="hoverline1"></span>
                <span className="hoverline2"></span>
                <span className="hoverline3"></span>
              </Link>
            </li>
            <li className="li_second"> | </li>
            <li className="li_first text-[13.5px]">
              <Link
                to="/nosotros"
                onClick={handleMenu}
                className="hover:text-gray-300"
              >
                NOSOTROS
                <span className="hoverline1"></span>
                <span className="hoverline2"></span>
                <span className="hoverline3"></span>
              </Link>
            </li>
            <li className="li_second"> | </li>
            <li className="li_first text-[13.5px]">
              <Link
                to="/contacto"
                onClick={handleMenu}
                className="hover:text-gray-300"
              >
                CONTACTO
                <span className="hoverline1"></span>
                <span className="hoverline2"></span>
                <span className="hoverline3"></span>
              </Link>
            </li>
            <li className="li_second"> | </li>
            <li className="li_first text-[13.5px] py-4">
              <BiSearchAlt2
                onClick={() => {
                  setIsSearchVisible(true)
                }}
                className="text-[2.5rem] text-white mx-4 transition-colors cursor-pointer "
              />
            </li>
          </ul>
          {/* </div> */}

          <div className="w-full hidden md:flex flex-col h-full">
            <div className="flex w-full justify-between items-center gap-4 py-4 h-full">
              <div className="w-[15%] min-w-[15%] h-full">
                <Link to="/" className="h-full block">
                  <img
                    src={logo_white}
                    width="100%"
                    className="h-full object-contain"
                  />
                </Link>
              </div>
              <div className="w-[70%] flex justify-between items-center gap-4 mx-auto px-10">
                <ul className={'nav list_pestañas flex-1'}>
                  <li className="li_first text-[13.5px]">
                    <Link
                      to="/formacionacademica"
                      onClick={handleMenu}
                      className="hover:text-gray-300"
                    >
                      CURSOS
                      <span className="hoverline1"></span>
                      <span className="hoverline2"></span>
                      <span className="hoverline3"></span>
                    </Link>
                  </li>
                  <li className="li_second"> | </li>
                  <li className="li_first text-[13.5px]">
                    <Link
                      to="/viewservicio/17"
                      onClick={handleMenu}
                      className="hover:text-gray-300"
                    >
                      ASESORIA DE TESIS
                      <span className="hoverline1"></span>
                      <span className="hoverline2"></span>
                      <span className="hoverline3"></span>
                    </Link>
                  </li>
                  <li className="li_second"> | </li>
                  <li className="li_first text-[13.5px]">
                    <Link
                      to="/nosotros"
                      onClick={handleMenu}
                      className="hover:text-gray-300"
                    >
                      NOSOTROS
                      <span className="hoverline1"></span>
                      <span className="hoverline2"></span>
                      <span className="hoverline3"></span>
                    </Link>
                  </li>
                  <li className="li_second"> | </li>
                  <li className="li_first text-[13.5px]">
                    <Link
                      to="/contacto"
                      onClick={handleMenu}
                      className="hover:text-gray-300"
                    >
                      CONTACTO
                      <span className="hoverline1"></span>
                      <span className="hoverline2"></span>
                      <span className="hoverline3"></span>
                    </Link>
                  </li>
                  <li className="li_second"> | </li>
                  <li className="li_first text-[13.5px]">
                    <BiSearchAlt2
                      onClick={() => {
                        setIsSearchVisible(true)
                      }}
                      className="text-[2.5rem] text-white mx-4 transition-colors cursor-pointer "
                    />
                  </li>
                </ul>
              </div>
              <div className="w-[16%] h-fit flex items-center justify-center gap-4">
                <Link
                  to="/carrito"
                  className="flex gap-2 relative px-4 h-full mr-4"
                >
                  <BsFillCartCheckFill className="text-white text-5xl" />
                  <span className="absolute -top-3 -right-4 text-black bg-white w-[20px] flex items-center justify-center h-[20px] rounded-full">
                    {cart.length}
                  </span>
                </Link>
                {auth.id
                  ? (
                  <button
                    type="button"
                    className="relative"
                    onMouseEnter={() => {
                      setCardUser(true)
                      if (timeoutId) {
                        clearTimeout(timeoutId)
                        setTimeoutId(null)
                      }
                    }}
                    onMouseLeave={() => {
                      const id = setTimeout(() => {
                        setCardUser(false)
                      }, 500)
                      setTimeoutId(id)
                    }}
                  >
                    <>
                      <img
                        src={
                          auth.foto
                            ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                            : defaultperfil
                        }
                        alt=""
                        className="rounded-full w-16 h-16  object-cover"
                      />

                      <AnimatePresence>
                        {cardUser && auth.id && (
                          <motion.div
                            initial={{ opacity: 0, right: '-200px' }}
                            animate={{ opacity: 1, right: '-70px' }}
                            exit={{ opacity: 0, right: '-200px' }}
                            transition={{ duration: 0.05 }}
                            className={`cardUserInfo ${
                              cardUser ? 'showCardUser' : ''
                            } overflow-hidden`}
                            onMouseEnter={() => {
                              if (timeoutId) {
                                clearTimeout(timeoutId)
                                setTimeoutId(null)
                              }
                            }}
                            onMouseLeave={() => {
                              const id = setTimeout(() => {
                                setCardUser(false)
                              }, 500)
                              setTimeoutId(id)
                            }}
                          >
                            <Link className="cardUserInfo__user" to="/perfil">
                              <div className="cardUserInfo__user__img">
                                <span>
                                  <img
                                    src={
                                      auth.foto
                                        ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                                        : defaultperfil
                                    }
                                    alt=""
                                    className="rounded-full h-full w-full object-cover object-center"
                                  />
                                </span>
                              </div>
                              <div className="cardUserInfo__user__info">
                                <h5 className="text-left">{auth.name}</h5>
                                <p>{auth.email}</p>
                              </div>
                            </Link>
                            <div className="cardUserInfo__seccion1">
                              <ul>
                                <li>
                                  <Link to="/perfil">
                                    <FaUserNurse />
                                    Ver perfil
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_cursos">
                                    <BiSolidBookmarks />
                                    Mis cursos
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_proyectos">
                                    <FaFolderOpen />
                                    Mis proyectos
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_constancias">
                                    <PiCertificateFill />
                                    Mis constancias
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/mis_compras">
                                    <GiShoppingBag />
                                    Mis compras
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="cardUserInfo__seccion1">
                              <ul>
                                <li>
                                <Link to="/perfil/edit">
                                    <IoMdSettings />
                                    Configuración
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/preguntas">
                                    <IoIosHelpCircle />
                                    Centro de ayuda
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="cardUserInfo__seccion1">
                              <ul>
                                <li
                                  onClick={() => {
                                    cerrarSession()
                                  }}
                                >
                                  <Link to="">
                                    <IoIosLogOut />
                                    Cerrar sesión
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  </button>
                    )
                  : (
                  <>
                    <Link
                      to="/login"
                      className="border border-white bg-white px-6 py-3 text-black font-bold text-[13.5px] transition-colors text-center rounded-lg"
                    >
                      Ingresar
                    </Link>
                  </>
                    )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`search ${isSearchVisible ? ' showSearch' : ''}`}
        ref={searchRef}
        onClick={toggleSearch}
      >
        <div className="search__content">
          <input
            placeholder="Ingresa un producto..."
            className="input"
            type="search"
            value={query}
            ref={inputRef}
            onFocus={handleInputFocus}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="icon">
            <Link
              to={`/search/${query}`}
              onClick={() => {
                setMenu(false)
                setQuery('')
              }}
            >
              <svg
                viewBox="0 0 512 512"
                className="ionicon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Search</title>
                <path
                  strokeWidth="32"
                  strokeMiterlimit="10"
                  stroke="currentColor"
                  fill="none"
                  d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
                ></path>
                <path
                  d="M338.29 338.29L448 448"
                  strokeWidth="32"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
