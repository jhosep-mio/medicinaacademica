import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../../../../helper/Global'

interface InterfaceImage {
  file: File | null
  preview: string | ArrayBuffer | null | undefined
}

interface valuesPreguntas {
  texto: string
  esCorrecta: boolean
  imagen: InterfaceImage | null
}

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  respuesta: valuesPreguntas[] | null
}

export const ViewRespuesta = ({
  open,
  setOpen,
  respuesta
}: valuesProps): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className='lg:w-[500px] lg:h-[500px]'>
        {respuesta
          ?.filter((res) => res.esCorrecta)
          .map((res: valuesPreguntas, index: number) => (
            <div key={index} className='flex items-center justify-center gap-10 flex-col w-full h-full'>
              <li
                className={
                  'border-2 px-4 py-6 text-3xl rounded-xl flex items-center relative group transition-colors w-full text-center border-green-600'
                }
              >
                <span
                  className={
                    'flex items-center px-4bg-green-600 absolute left-0 top-0 bottom-0 justify-center m-auto w-16 transition-colors'
                  }
                >
                </span>
                <p className="text-center w-full">{res.texto}</p>
              </li>
              <img
                src={`${Global.urlImages}/examenes/${
                  // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                  res.imagen?.preview ?? ''
                }`}
                alt=""
                className="h-[300px] mx-auto w-full object-contain"
              />
            </div>
          ))}
      </DialogContent>
    </Dialog>
  )
}
