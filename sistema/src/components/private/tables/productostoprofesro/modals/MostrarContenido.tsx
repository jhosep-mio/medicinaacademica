import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  contenido: string
}

export const MostrarContenido = ({
  open,
  setOpen,
  contenido
}: valuesProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="w-[500px]">
        <div
          dangerouslySetInnerHTML={{
            __html: contenido
          }}
          className=" w-full "
        />
      </DialogContent>
    </Dialog>
  )
}
