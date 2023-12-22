import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../../../../helper/Global'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  imagen: string | ArrayBuffer | null | undefined
}

export const ViewImage = ({
  open,
  setOpen,
  imagen
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
      <DialogContent>
        {imagen && (
          <div className='lg:w-[500px] lg:h-[600px]'>
            <img
              src={`${Global.urlImages}/examenes/${
                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                imagen ?? ''
              }`}
              alt="Imagen en grande"
              className='w-full h-full object-contain'
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
