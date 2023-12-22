import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'

export const ModalCalificacion = ({ open, setOpen, nota, setNota, handleCalificar }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, nota: string, setNota: Dispatch<SetStateAction<string>>, handleCalificar: () => Promise<void> }): JSX.Element => {
  return (
    <Dialog
    open={open}
    onClose={() => { setOpen(false) }}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    className='modal_index'
  >

    <DialogContent className='flex gap-4 flex-col w-[500px]'>
        <h1 className='w-full text-center text-black font-bold text-2xl uppercase'>Colocar calificación</h1>
        <input type="number" className='border py-2 px-2' value={nota} onChange={(e) => { setNota(e.target.value) }}/>

        <button className='mx-auto bg-red-500 rounded-xl py-2  text-white font-bold px-4'
        type='button'
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={
            async () => {
              await handleCalificar()
            }}>Enviar calificación</button>
    </DialogContent>
  </Dialog>
  )
}
