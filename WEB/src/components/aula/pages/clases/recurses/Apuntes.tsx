import { type apuntesValues } from '../../../../shared/Interfaces'
import { RiPencilFill } from 'react-icons/ri'
interface valuesProps {
  apuntes: apuntesValues[]
  claseId: string | undefined
  handleTimeClick: (formattedTime: string) => void
}

export const Apuntes = ({ apuntes, claseId, handleTimeClick }: valuesProps): JSX.Element => {
  return (
    <section className="lg:min-h-[200px] px-10 py-8 flex flex-col gap-4 ">
      {apuntes &&
        apuntes.length > 0 &&
        apuntes
          .filter((apunte) => apunte.claseId == claseId)
          .map((apunte, index: number) => (
            <div
              key={index}
              className="bg-[#24385b]  rounded-xl w-full h-fit flex gap-3 items-start hover:bg-[#24385b80] transition-colors cursor-pointer relative"
            >
              <div className="cursor-pointer flex items-start w-[96%] h-fit p-6" onClick={() => { handleTimeClick(apunte.tiempo) }}>
                <span className="text-secondary-70 font-bold w-fit py-4">
                  {apunte.tiempo} -
                </span>
                <p
                  placeholder="Escribir apunte"
                  className="w-full flex-1 h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-2xl break-words"
                >
                  {apunte.texto}
                </p>
              </div>
              <div className=' absolute top-3 right-3 w-auto flex-1 border border-secondary-70 rounded-xl p-2 hover:bg-secondary-70 text-secondary-70 hover:text-white cursor-pointer' >
                <RiPencilFill className='text-2xl' />
              </div>
            </div>
          ))}
    </section>
  )
}
