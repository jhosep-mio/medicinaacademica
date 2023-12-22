import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { type Dispatch, type SetStateAction } from 'react'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  imagen: string | null
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
          <div className="modal">
            <img src={imagen} alt="Imagen en grande" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
