import { type Dispatch, type SetStateAction } from 'react'
import { Dialog, DialogContent } from '@mui/material'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  video: string
}

export const ModalVideoYOu2 = ({
  open,
  setOpen,
  video
}: valuesProps): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_modal_comentario"
    >
      <DialogContent
        className=' w-full h-full'
      >
          <iframe
                        src={video}
                        title="YouTube video player"
                        frameBorder="0"
                        className='w-full h-full'
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
      </DialogContent>
    </Dialog>
  )
}
