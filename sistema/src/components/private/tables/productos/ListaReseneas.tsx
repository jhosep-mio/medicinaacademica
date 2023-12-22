import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { type comentariosValues } from '../../../shared/Interfaces'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import useAuth from '../../../../hooks/useAuth'
import { ListaRese } from './sections/ListaRese'
import { AgregarReseña } from './modals/AgregarReseña'

export const ListaReseneas = (): JSX.Element => {
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const { id } = useParams()
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [open, setopen] = useState(false)

  const getComentarios = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showAdmin/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ''}`
        }
      }
    )
    if (
      request.data[0].comentariosfinales &&
      JSON.parse(request.data[0].comentariosfinales).length > 0
    ) {
      setComentarios(JSON.parse(request.data[0].comentariosfinales))
    }
    setLoading(false)
  }

  useEffect(() => {
    setTitle('Listado de comentarios')
    getComentarios()
  }, [])

  return (
    <>
      {!loading
        ? <>
        <div className='flex justify-between'>
            <Link to={'/admin/productos/'} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold mb-6 block w-fit">REGRESAR</Link>
            <button
            onClick={() => { setopen(true) }}
            className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold mb-6 block w-fit">AGREGAR RESEÑA</button>
        </div>

      <ListaRese comentarios={comentarios} setComentarios={setComentarios} cursoId={id}/>
      <AgregarReseña openComentario={open} setOpenComentario={setopen} cursoId={id} getComentarios={getComentarios} setComentarios={setComentarios}/>

      </>
        : <Loading/>}
    </>
  )
}
