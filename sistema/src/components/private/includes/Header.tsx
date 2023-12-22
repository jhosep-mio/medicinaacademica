import { RiArrowDownSLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { defaultperfil } from '../../shared/Images'

const Header = (): JSX.Element => {
  const { auth, setLoading, setAuth, title } = useAuth()
  const navigate = useNavigate()

  const cerrarSession = async (): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')

    const data = new FormData()
    data.append('_method', 'POST')

    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.clear()
    setAuth({
      id: '',
      name: '',
      email: '',
      idRol: null,
      foto: ''
    })
    navigate('/login')
    setLoading(false)
  }

  return (
    <header className="h-[7vh] md:h-[10vh] border-b border-secondary-100 p-8 flex items-center justify-between">
      <div className="flex gap-3 md:gap-5">
        <p className="font-bold text-white  text-sm md:text-xl">{title}</p>
      </div>
      <nav className="flex items-center gap-2">
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 hover:bg-secondary-100 p-2 rounded-lg transition-colors">
              <img
                src={
                  auth.foto
                    ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                    : defaultperfil
                }
                className="w-8 h-8 object-contain rounded-full"
              />
              <span>{auth.name}</span>
              <RiArrowDownSLine />
            </MenuButton>
          }
          align="end"
          arrow
          transition
          menuClassName="bg-secondary-100 p-4"
        >
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/perfil"
              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <img
                src={
                  auth.foto
                    ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                    : defaultperfil
                }
                className="w-10 h-10 object-contain rounded-full"
              />
              <div className="flex flex-col text-sm">
                <span className="text-sm">{auth.name}</span>
                <span className="text-xs text-gray-500">{auth.email}</span>
              </div>
            </Link>
          </MenuItem>

          <hr className="my-4 border-gray-500" />
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to=""
              onClick={() => {
                void cerrarSession()
              }}
              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <RiLogoutCircleRLine /> Cerrar sesión
            </Link>
          </MenuItem>
        </Menu>
      </nav>
    </header>
  )
}

export default Header
