import { useEffect, useState } from 'react'
import { ListaComentarios } from './ListaComentarios'
import { type comentariosValues } from '../../../../shared/Interfaces'
import { Global } from '../../../../../helper/Global'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { CrearComentario } from './CrearComentario'
import { ResponderComentario } from './ResponderComentario'
import { Loading } from '../../../../shared/Loading'

export const ComentariosTwo = (): JSX.Element => {
  const [texto, setTexto] = useState<string | undefined>('')
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const { id, claseId } = useParams()
  const token = localStorage.getItem('tokenProfesor')
  const [open, setOpen] = useState(false)
  const [idComentario, setIdComentario] = useState<string | undefined>('')
  const [loading, setLoading] = useState(true)

  const getComentarios = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getComentarios3/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ''}`
        }
      }
    )
    if (
      request.data[0].comentarios &&
      JSON.parse(request.data[0].comentarios).length > 0
    ) {
      setComentarios(JSON.parse(request.data[0].comentarios))
    }
    setLoading(false)
  }

  useEffect(() => {
    getComentarios()
  }, [])

  return (
    <>
      {!loading
        ? <>
      <Link to={`/admin/cursos/seguimiento/${id ?? ''}`} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold mb-6 block w-fit">REGRESAR</Link>
      <CrearComentario
        comentarios={comentarios}
        setComentarios={setComentarios}
        cursoId={id}
        claseId={claseId}
        getComentarios={getComentarios}
      />

      <ListaComentarios
        comentarios={comentarios}
        claseId={claseId}
        setOpen={setOpen}
        getComentarios={getComentarios}
        cursoId={id}
        setIdComentario={setIdComentario}
        setTexto={setTexto}
      />

      <ResponderComentario
        textoComentario={texto}
        open={open}
        setOpen={setOpen}
        setIdComentario={setIdComentario}
        idComentario={idComentario}
        comentarios={comentarios}
        setComentarios={setComentarios}
        cursoId={id}
        claseId={claseId}
        getComentarios={getComentarios}
      />
      </>
        : <Loading/>}
    </>
  )
}
