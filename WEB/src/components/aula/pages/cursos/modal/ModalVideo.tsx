import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { type Dispatch, type SetStateAction } from 'react'
import { video } from '../../../../shared/images'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const ModalVideo = ({ open, setOpen }: valuesProps): JSX.Element => {
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
      <DialogContent>
        <video className="w-full h-full object-cover" muted loop>
          <source src={video} type="video/mp4" />
        </video>
      </DialogContent>
    </Dialog>
  )
}
