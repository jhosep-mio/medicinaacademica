import { Global } from '../../../../../helper/Global'
import { type productosValues } from '../../../../shared/Interfaces'
import { favicon } from '../../../../shared/images'

export const CardCurso = ({ curso }: { curso: productosValues }): JSX.Element => {
  return (
    <div className="rounded-xl relative overflow-hidden shadow-md glass_curse" key={curso.id}>
      <img src={`${Global.urlImages}/productos/${curso.imagen1}`} alt="" className="w-full h-[200px] object-cover"/>
      <div className="cart_curses bg-secondary-100 py-6 px-6 gap-3 flex z-10 relative items-center before:absolute before:bottom-full before:w-full before:h-[15rem] before:left-0 before:right-0 before:z-[-1]">
        <div className=" flex-1">
          <p className="line-clamp-1 text-2xl text-white">
            {curso.nombre}
          </p>
          <p className="line-clamp-1 text-[1.5rem] text-[#b7b7b7]">
            Por {curso.profesor}
          </p>
        </div>
        <div className="border border-white rounded-full">
          <img
            src={favicon}
            alt=""
            className="m-auto w-16 h-16 object-contain"
          />
        </div>
      </div>
    </div>
  )
}
