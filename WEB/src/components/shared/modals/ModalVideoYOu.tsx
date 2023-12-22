import { type Dispatch, type SetStateAction } from 'react'
import { Dialog, DialogContent } from '@mui/material'

import YouTube from 'react-youtube'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  video: string
}

export const ModalVideoYOu = ({
  open,
  setOpen,
  video
}: valuesProps): JSX.Element => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      encryptedMedia: 0,
      modestbranding: 0,
      controls: 1,
      showinfo: 0,
      rel: 0,
      fs: 1, // Permitir pantalla completa
      iv_load_policy: 0,
      disablekb: 0
    }
  }
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
          <YouTube videoId={video} opts={opts} className='w-full h-full'/>
      </DialogContent>
    </Dialog>
  )
}
