import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import { blogValues } from '../../../shared/Interfaces'
import { DeleteItems } from '../../../shared/DeleteItems'
import { LoadingSmall } from '../../../shared/LoadingSmall'

export const ListarBlog = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState([])
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)

  const navigate = useNavigate()

  const getAllProductos = async (): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('buscar', search)
    const request = await axios.get(`${Global.url}/getBlogs`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProductos(request.data)
    setTotalRegistros(request.data.length)
    setLoadingComponents(false)
  }

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  const totalPosts = productos.length

  const filterDate = (): never[] => {
    return productos.slice(indexOfFirstPost, indexOfLastPost)
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const preguntar = (id: number): void => {
    DeleteItems({
      ruta: 'deleteBlog',
      id,
      token,
      getData: getAllProductos,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual
    })
  }

  useEffect(() => {
    setTitle('Listado de Blogs')
  }, [])

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5 ">
        <div>
          {/* <h1 className="font-bold text-gray-100 text-xl">Lista de Productos</h1> */}
        </div>
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
          <button className="bg-secondary-100/50 hover:bg-secondary-100  w-full md:w-fit flex items-center  gap-2 py-2 px-4 rounded-lg hover:text-white transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
            <button
              className="text-white bg-main h-full px-3 py-1 rounded-lg"
              onClick={() => {
                !loadingComponents && getAllProductos()
              }}
            >
              {!loadingComponents
                ? (
                    'Buscar'
                  )
                : (
                <div>
                  <LoadingSmall />
                </div>
                  )}
            </button>
          </button>
          <button
            className="bg-main text-white hover:bg-main w-full lg:w-fit flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              navigate('agregar')
            }}
          >
            Crear
          </button>
        </div>
      </div>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <div className="bg-secondary-100 p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 p-4">
            <h5 className="md:text-center">ID</h5>
            <h5 className="md:text-center">Título</h5>
            <h5 className="md:text-center">Imagen</h5>
            <h5 className="md:text-center">Resumen</h5>
            <h5 className="md:text-center">Acciones</h5>
          </div>
          {filterDate().map((blog: blogValues) => (
            <div
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
              key={blog.id}
            >
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">ID</h5>
                <span>#{blog.id}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Título</h5>
                <span>{blog.titulo}</span>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-white font-bold mb-2">Imagen</h5>
                <img
                  src={`${Global.urlImages}/blog/${blog.imagen1}`}
                  alt=""
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">
                  Resumen
                </h5>
                <span>{blog.resumen}</span>
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
                      to={`editar/${blog.id}`}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                    >
                      Editar
                    </Link>
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    <Link
                      to=""
                      onClick={() => {
                        preguntar(blog.id)
                      }}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                    >
                      Eliminar
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-between content_buttons ">
            <p className="text-md ml-1"> {totalRegistros} Registros </p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
          )}
    </>
  )
}
