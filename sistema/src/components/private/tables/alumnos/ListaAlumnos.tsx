import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { RiEyeLine, RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import {
  type valuesTransaccion,
  type estudiantesValues
} from '../../../shared/Interfaces'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import defaulperful from './../../../../assets/cursos/default.jpg'

export const ListaAlumnos = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [estudiantes, setProductos] = useState<estudiantesValues[]>([])
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)
  const [transacciones, setTransacciones] = useState<valuesTransaccion[]>([])

  const getEstudiantes = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getEstudiantes`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProductos(request.data)
    setTotalRegistros(request.data.length)
    setLoadingComponents(false)
  }

  const getTransacciones = async (): Promise<void> => {
    const data = new FormData()
    data.append('buscar', search)
    const request = await axios.post(`${Global.url}/getTransaccion`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setTransacciones(request.data)
  }

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  const totalPosts = estudiantes.length

  const filterDate = (): estudiantesValues[] => {
    return estudiantes.slice(indexOfFirstPost, indexOfLastPost)
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  useEffect(() => {
    setTitle('Listado de alumnos')
    getTransacciones()
    getEstudiantes()
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
                !loadingComponents && getEstudiantes()
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
        ? <Loading />
        : (
        <div className="bg-secondary-100 p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-7 gap-4 mb-10 p-4">
            <h5 className="md:text-center">ID</h5>
            <h5 className="md:text-center">Foto</h5>
            <h5 className="md:text-center">Nombres</h5>
            <h5 className="md:text-center">Celular</h5>
            <h5 className="md:text-center">Email</h5>
            <h5 className="md:text-center">Cursos adquiridos</h5>
            <h5 className="md:text-center">Ver</h5>
          </div>
          {filterDate().map((pro: estudiantesValues) => (
            <div
              className={
                'grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl'
              }
              key={pro.id}
            >
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">ID</h5>
                <span>#{pro.id}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Cliente</h5>
                {pro.imagen1
                  ? (
                  <img
                    src={`${Global.urlImages}/fotoperfil/${pro.imagen1 ?? ''}`}
                    className="w-14 h-14 rounded-full object-contain mx-auto"
                  />
                    )
                  : (
                  <img
                    src={defaulperful}
                    className="w-14 h-14 rounded-full object-contain mx-auto"
                  />
                    )}
              </div>

              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Cliente</h5>
                <span>
                  {pro.nombres} {pro.apellidos}
                </span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Cliente</h5>
                <span>{pro.celular}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Cliente</h5>
                <span>{pro.email}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-white font-bold mb-2">Cliente</h5>
                {(() => {
                  let contador = 0 // Inicializa el contador
                  transacciones.forEach((transaccion) => {
                    if (transaccion.comentario == String(pro.id)) {
                      contador++ // Incrementa el contador si el comentario coincide
                    }
                  })
                  // Puede retornar el contador o cualquier otro elemento JSX aquí
                  return <span>{contador}</span>
                })()}
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-white font-bold mb-2">VER</h5>
                <Link to={`view/${pro.id}`}>
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
