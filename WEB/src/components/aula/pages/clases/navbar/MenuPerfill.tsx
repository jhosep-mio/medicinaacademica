import { Link, useNavigate } from 'react-router-dom'
import { FaUserNurse, FaFolderOpen } from 'react-icons/fa'
import {
  BiSolidBookmarks
} from 'react-icons/bi'
import { motion, AnimatePresence } from 'framer-motion'
import { PiCertificateFill } from 'react-icons/pi'
import { IoMdSettings, IoIosHelpCircle, IoIosLogOut } from 'react-icons/io'
import useAuth from '../../../../../hooks/useAuth'
import { useEffect, useState } from 'react'
import { Global } from '../../../../../helper/Global'
import { defaultperfil } from '../../../../shared/images'
import axios from 'axios'
import { GiShoppingBag } from 'react-icons/gi'
export const MenuPerfill = (): JSX.Element => {
  const { auth, setAuth, loading } = useAuth()
  const [cardUser, setCardUser] = useState(false)
  const [timeoutId, setTimeoutId] = useState<any | null>(null)
  const token = localStorage.getItem('tokenUser')
  const navigate = useNavigate()

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
      onlyname: '',
      lastname: '',
      foto: '',
      portada: ''
    })
  }

  useEffect(() => {
    if (!loading && !auth.id) {
      navigate('/login')
    }
  }, [auth.id, loading])

  return (
    <>
      {auth.id
        ? (
        <button
          type="button"
          className="absolute right-[8rem] top-8 "
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
              className="rounded-full w-16 h-16"
            />

            <AnimatePresence>
              {cardUser && auth.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
                        <Link to="">
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
          )
        : (
        <>
          <Link
            to="/login"
            className="border border-white bg-white px-6 py-3 text-black font-bold text-[13.5px] transition-colors"
          >
            Iniciar Sesión
          </Link>
        </>
          )}
    </>
  )
}
