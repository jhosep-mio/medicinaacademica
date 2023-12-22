import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { RiEyeLine, RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import { type valuesTransaccion } from '../../../shared/Interfaces'
import { LoadingSmall } from '../../../shared/LoadingSmall'

export const ListaTransacciones = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState([])
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)

  const getAllProductos = async (): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('buscar', search)
    const request = await axios.post(`${Global.url}/getTransaccion`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProductos(request.data)
    setTotalRegistros(request.data.length)
    setLoadingComponents(false)
  }

  const getTransacciones = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getTransacciones`, {
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

  useEffect(() => {
    setTitle('Listado de Transacciones')
    getTransacciones()
  }, [])

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5 ">
        <div>
          {/* <h1 className="font-bold text-gray-100 text-xl">Lista de Productos</h1> */}
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <button className="bg-secondary-100/50 hover:bg-secondary-100 w-full  md:w-fit flex items-center  gap-2 py-2 px-4 rounded-lg hover:text-white transition-colors">
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
            <h5 className="md:text-center">Cliente</h5>
            <h5 className="md:text-center">Id Transacción</h5>
            <h5 className="md:text-center">Estado</h5>
            <h5 className="md:text-center">Ver</h5>
          </div>
          {filterDate().map((pro: valuesTransaccion) => (
            <div
              className={`grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 ${
                pro.status == 'approved' || pro.status == 'Por confirmar'
                  ? 'bg-secondary-900'
                  : 'bg-red-500'
              } p-4 rounded-xl`}
              key={pro.id}
            >
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">ID</h5>
                <span>#{pro.id}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Cliente</h5>
                <span>
                  {pro.nombres} {pro.apellidos}
                </span>
              </div>

              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">
                  Id Transacción
                </h5>
                <span className='line-clamp-1'>{pro.id_transaccion}</span>
              </div>
              {pro.status == 'approved' || pro.status == 'Por confirmar'
                ? (
                <div className="md:text-center">
                  <h5 className="md:hidden text-white font-bold mb-2">
                    Estado
                  </h5>
                  {pro.estado == 0
                    ? (
                    <span className="bg-green-500 py-2 px-3 text-black  rounded-md">
                      PENDIENTE
                    </span>
                      )
                    : pro.estado == 3
                      ? (
                    <span className="bg-main py-2 px-3 text-white  rounded-md">
                      POR REVISAR
                    </span>
                        )
                      : pro.estado == 1
                        ? (
                    <span className="bg-red-500 py-2 px-3 text-white  rounded-md">
                      TERMINADO
                    </span>
                          )
                        : (
                            ''
                          )}
                </div>
                  )
                : (
                <div className="md:text-center">
                  <h5 className="md:hidden text-white font-bold mb-2">
                    Estado
                  </h5>
                  <span className="bg-yellow-300 py-2 px-3 text-black  rounded-md">
                    RECHAZADO
                  </span>
                </div>
                  )}

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-white font-bold mb-2">VER</h5>
                <Link to={`viewTransaccion/${pro.id}`}>
                  <RiEyeLine className="text-2xl text-whtie" />
                </Link>
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
