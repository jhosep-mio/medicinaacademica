import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { type Dispatch, type SetStateAction, useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { useFormik } from 'formik'
import { Errors } from '../../shared/Errors'
import Swal from 'sweetalert2'
import { FormCodigoRecuperacion } from './FormCodigoRecuperacion'
import { FormContraseñaDoble } from './FormContraseñaDoble'

interface valueProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface Values {
  email: string
}

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido')
})

export const ModalRecuperacion = ({
  open,
  setOpen
}: valueProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const [loadingComponents, setLoadingComponents] = useState(false)

  const validar = async (values: Values): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('email', values.email)
    data.append('_method', 'POST')
    try {
      const respuesta = await axios.post(`${Global.url}/restablecerContra`, data)
      if (respuesta.data.status === 'success') {
        setEstado(1)
        Swal.fire('Se envio un codigo de verificación', 'Revise su bandeja de entrada', 'success')
      } else if (respuesta.data.status === 'correo') {
        Swal.fire('No existe ninguna cuenta asociada a este correo', '', 'warning')
      }
    } catch (error) {
      Swal.fire('Se genero un error al intentar recuperar su contraseña', '', 'error')
    }
    setLoadingComponents(false)
  }

  const [estado, setEstado] = useState(0)

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        email: ''
      },
      validationSchema: Schema,
      onSubmit: validar
    })

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className='modal_recuperacion'
    >
      <DialogContent className=''>
        {estado == 0
          ? <section className="h-fit py-10 w-full lg:px-10 inset-0 lg:inset-[inherit] lg:right-0 lg:top-0 bg-white flex flex-col justify-center items-center content_blur shadow-black shadow-xl">
         <h1 className=" w-full text-center text-2xl lg:text-5xl text-primary font-bold uppercase">
           Restablecer contraseña
         </h1>
         <span className='text-center text-2xl pt-4'>Te enviaremos instrucciones a tu correo electrónico de registro para restablecer tu contraseña</span>
         <form
           className="w-full mt-10 flex flex-col gap-10"
           onSubmit={handleSubmit}
         >
           <div className="flex flex-col w-full gap-4">
             <div className="input-container w-full relative py-3">
             <label
                 className="label px-[0.4rem] text-black text-2xl"
                 style={{ top: `${values.email.length > 0 ? '-12px' : ''}` }}
               >
                 Email
               </label>
               <input
                 type="email"
                 id="input"
                 name="email"
                 value={values.email}
                 onBlur={handleBlur}
                 onChange={handleChange}
                 className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-2xl"
               />
               <Errors errors={errors.email} touched={touched.email} />
             </div>
           </div>
           <div className="flex flex-col gap-4">
             {!loadingComponents
               ? (
               <button
                 type="submit"
                 className="bg-primary px-4 py-3 text-white rounded-sm text-2xl"
               >
                 Enviar
               </button>
                 )
               : (
               <button
                 type="button"
                 disabled
                 className="bg-primary px-4 py-3 text-white rounded-sm text-2xl"
               >
                 Validando...
               </button>
                 )}
           </div>
         </form>
       </section>
          : estado == 1
            ? <FormCodigoRecuperacion setEstado={setEstado} email={values.email}/>
            : <FormContraseñaDoble setOpen={setOpen} setEstado={setEstado} email={values.email}/>}
      </DialogContent>
    </Dialog>
  )
}
