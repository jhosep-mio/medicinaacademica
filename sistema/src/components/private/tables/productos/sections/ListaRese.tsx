import { type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../../../../helper/Global'
import { defaultperfil } from '../../../../shared/Images'
import { type comentariosValues } from '../../../../shared/Interfaces'
import Rating from '@mui/material/Rating'
import axios from 'axios'
import Swal from 'sweetalert2'

export const ListaRese = ({ comentarios, setComentarios, cursoId }: { comentarios: comentariosValues[], setComentarios: Dispatch<SetStateAction<comentariosValues[]>>, cursoId: string | undefined }): JSX.Element => {
  const eliminarComentario = (id: number): void => {
    // Filtrar los comentarios, excluyendo el comentario con el ID proporcionado
    const nuevosComentarios = comentarios.filter((comentario) => comentario.id !== id)
    setComentarios(nuevosComentarios)
    agregarResumen(nuevosComentarios)
  }
  const token = localStorage.getItem('token')

  const agregarResumen = async (nuevosComentarios: comentariosValues[]): Promise<void> => {
    const data = new FormData()
    data.append('comentariosfinales', JSON.stringify(nuevosComentarios))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
                `${Global.url}/saveComentariofinal2/${cursoId ?? ''}`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
                  }
                }
      )
      if (respuesta.data.status == 'success') {
        Swal.fire('Comentario eliminado', '', 'success')
      } else {
        Swal.fire('Error al subir', '', 'error')
      }
    } catch (error: unknown) {
      console.log(error)
      Swal.fire('Error al subir', '', 'error')
    }
  }

  return (
    <section className="grid grid-cols-3 gap-10">
        {comentarios
          ? <>
            {comentarios.map((comentario, index: number) => (
                <div className="flex flex-col gap-4 bg-[#1e315b95] p-6 rounded-xl relative" key={index}>
                    <span className='text-3xl absolute right-4 top-0 text-red-500 cursor-pointer' onClick={() => { eliminarComentario(comentario.id) }}>x</span>
                    <div className="flex gap-4 items-start">
                    <div>
                        <img
                        src={
                            comentario.foto
                              ? `${Global.urlImages}/fotoperfil/${comentario.foto ?? ''}`
                              : defaultperfil
                          }
                        alt=""
                        className="w-16 h-16 object-contain rounded-full"
                        />
                    </div>
                    <div className="flex flex-col gap-0">
                        <span className="text-2xl">{comentario.user}</span>
                        <span className="text-gray-400 text-2xl">{comentario.fecha}</span>
                        <span className="text-gray-400 text-2xl">
                        <Rating
                            name="read-only"
                            className="text-4xl"
                            value={Number(comentario.clase)}
                            precision={0.5}
                            readOnly
                        />
                        </span>
                    </div>
                    </div>
                    <div className="px-4">
                    <p className="text-[1.4rem] break-words">{comentario.texto}</p>
                    </div>
                </div>
            ))}
        </>
          : null
        }
    </section>
  )
}
