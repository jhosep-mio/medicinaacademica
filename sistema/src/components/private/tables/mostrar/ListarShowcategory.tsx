import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { mostrarValues} from '../../../shared/Interfaces'
const ListarShowcategory = () => {
  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState([])
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const getAllProductos = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getMostrar`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    
    setProductos(request.data)
    setLoadingComponents(false)
  }




  useEffect(() => {
    setTitle('Lista de anuncios')
    getAllProductos()
  }, [])

  return (
    <>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5 ">
      <div>
        {/* <h1 className="font-bold text-gray-100 text-xl">Lista de Productos</h1> */}
      </div>
      
    </div>
    {loadingComponents
      ? (
      <Loading />
        )
      : (
      <div className="bg-secondary-100 p-8 rounded-xl">
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4">
          <h5 className="md:text-center">ID</h5>
          <h5 className="md:text-center">Imagen</h5>
          <h5 className="md:text-center">Acciones</h5>
        </div>
        {productos.map((pro: mostrarValues) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
            key={pro.id}
          >
            <div className="md:text-center">
              <h5 className="md:hidden text-white font-bold mb-2">ID</h5>
              <span>#{pro.id}</span>
            </div>
            <div className="md:text-center md:flex md:justify-center">
              <h5 className="md:hidden text-white font-bold mb-2">Imagen</h5>
              <img
                  src={`${Global.urlImages}/mostrar/${pro.imagen1}`}
                  alt=""
                  className="w-12 h-12 object-contain"
                />
            </div>
            <div className="md:text-center md:flex md:justify-center">
              <h5 className="md:hidden text-white font-bold mb-2">
                Acciones
              </h5>
              <Menu
                menuButton={
                  <MenuButton className="flex items-center gap-x-2 bg-secondary-100 p-2 rounded-lg transition-colors">
                    Acciones
                  </MenuButton>
                }
                align="end"
                arrow
                transition
                menuClassName="bg-secondary-100 p-4"
              >
                <MenuItem className="p-0 hover:bg-transparent">
                  <Link
                    to={`editar/${pro.id}`}
                    className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                  >
                    Editar
                  </Link>
                </MenuItem>

              </Menu>
            </div>
          </div>
        ))}

       
      </div>
        )}
    </>
  )
}

export default ListarShowcategory