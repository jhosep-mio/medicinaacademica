import { IoStarSharp } from 'react-icons/io5'
import { type comentariosValues } from '../../../../shared/Interfaces'
import { Fragment } from 'react'
import { Global } from '../../../../../helper/Global'
import { defaultperfil } from '../../../../shared/images'

export const ListaToValoracion = ({
  comentarios
}: {
  comentarios: comentariosValues[]
}): JSX.Element => {
  const ultimosComentarios = comentarios.slice(-3)
  return (
    <>
      {ultimosComentarios?.map((comentario, index: number) => (
            <Fragment key={index}>
                <div className="mt-10 text-gray-300">
                <div className="w-full flex gap-3 justify-between items-center">
                    <div className="w-fit flex gap-3 items-center">
                    <img
                        src={
                        comentario.foto
                          ? `${Global.urlImages}/fotoperfil/${
                                comentario.foto ?? ''
                            }`
                          : defaultperfil
                        }
                        alt=""
                        className="w-16 h-16 object-contain rounded-full"
                    />
                    <span className="text-3xl line-clamp-1">
                        {comentario.user}
                    </span>
                    </div>
                    <div className="flex gap-3 items-center">
                    <IoStarSharp className="text-4xl text-gray-400" />
                    <span className="mt-2 text-5xl">
                        {Number(comentario.clase)}
                    </span>
                    </div>
                </div>
                </div>
                <hr className="my-6" />
            </Fragment>
      ))}
    </>
  )
}
