import { Global } from '../../../../../helper/Global'
import { type comentariosValues } from '../../../../shared/Interfaces'
import { defaultperfil } from '../../../../shared/images'
import Rating from '@mui/material/Rating'
export const ListaComentarios = ({ comentarios }: { comentarios: comentariosValues[] }): JSX.Element => {
  return (
    <section className="grid grid-cols-3 gap-10">
        {comentarios
          ? <>
            {comentarios.map((comentario, index: number) => (
                <div className="flex flex-col gap-4 bg-[#1e315b95] p-6 rounded-xl" key={index}>
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
