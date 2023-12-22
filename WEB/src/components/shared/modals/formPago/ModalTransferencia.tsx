import { Dialog, DialogContent } from '@mui/material'
import {
  useState,
  type Dispatch,
  type SetStateAction
} from 'react'
import bcp from '../../../../assets/varios/bcp.png'
import bbva from '../../../../assets/varios/bbva.png'
import { FaTrash } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { type productosValues, type datosValues } from '../../Interfaces'
import useAuth from '../../../../hooks/useAuth'
import { Global } from '../../../../helper/Global'

interface valuesProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  preferenceId: string
  medio: string
  values: datosValues | null
  curso: productosValues | null
}

export const ModalTransferencia = ({
  open,
  setOpen,
  preferenceId,
  medio,
  values,
  curso
}: valuesProps): JSX.Element => {
  const [file, setFile] = useState<File | null>(null)
  const { auth, setCart } = useAuth()
  const [cargando, setCargando] = useState(false)

  const handleFileChange = (e: any): void => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const navigate = useNavigate()

  const handleSubirInformes = async (): Promise<void> => {
    setCargando(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    const uniqueId = uuidv4()

    let dataempresa = null
    if (file != undefined && values && curso != null) {
      if (values.nombre_empresa && values.ruc && values.direccion_fiscal) {
        dataempresa = {
          nombre_empresa: values.nombre_empresa,
          ruc: values.ruc,
          direccion_fiscal: values.direccion_fiscal
        }
      }
      const carrito = [{
        id: curso.id,
        nombre: curso.nombre,
        precio: curso.precio2 !== null ? parseFloat(String(curso.precio2)) : 0,
        cantidad: 1,
        imagen1: `${Global.urlImages}/productos/${curso.imagen1}`
      }]
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      data.append('id_transaccion', preferenceId)
      data.append('status', 'Por confirmar')
      data.append('tipo', medio)
      data.append('order_id', uniqueId)
      data.append('nombres', values.nombres)
      data.append('apellidos', values.apellidos)
      data.append('email', values.email)
      data.append('celular', values.celular)
      data.append('comentario', auth.id ? auth.id : 'notiene')
      data.append('delivery', uniqueId)
      data.append('total_pago', String(curso?.precio2))
      data.append('array_productos', JSON.stringify(carrito))
      data.append('estado', '3')
      data.append('datos_empresa', dataempresa ? JSON.stringify(dataempresa) : '')
      data.append('pdffactura', '')
      data.append('iainteraction', 'SI')
      data.append('captura', file)
    }

    try {
      const respuesta = await axios.post(
        `${Global.url}/handleSuccessTransaction`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        Swal.fire('Comprobante enviado', '', 'success')
        setOpen(false)
        setCart([])
        localStorage.setItem('cart', '[]')
        navigate(`/success-pago/${String(uniqueId)}`)
      } else {
        Swal.fire('Error al enviar comprobante', '', 'warning')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al enviar comprobante', '', 'error')
    }
    setCargando(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className='modal_transferencia'
    >
      <DialogContent className="w-[400px]">
        <h5 className="text-[2rem] uppercase text-[#094173] text-center font-extrabold my-10">
          {!file ? 'Aceptamos transferencias' : 'Comprobante de pago'}
        </h5>
        <div className="contentTransferencia">
          <div className="contentTransferencia__main">
            {!file
              ? (
              <>
                <div className="contentTransferencia__main__item">
                  <img src={bbva} alt="" />
                  <div className="data">
                    <span className="font-bold text-[#094173]">BBVA</span>
                    <p>0011-0094-0100015156</p>
                    <p>011-094-00010001515601</p>
                  </div>
                </div>
                <div className="contentTransferencia__main__item">
                  <img src={bcp} alt="" />
                  <div className="data">
                    <span className="font-bold text-[#094173]">BCP</span>
                    <p>1949943587070</p>
                    <p>00219400994358707096</p>
                  </div>
                </div>
              </>
                )
              : (
              <div className="relative w-full">
                <span
                  className="absolute top-0 right-0 text-red-500 text-3xl cursor-pointer"
                  onClick={() => {
                    setFile(null)
                  }}
                >
                  <FaTrash />
                </span>
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-[250px] object-contain"
                  alt="Vista previa del comprobante"
                />
              </div>
                )}
          </div>
        </div>
        {!file
          ? (
          <div className="relative group">
            <input
              type="file"
              className="absolute inset-0 w-full h-full file:hidden cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="w-full text-2xl bg-green-600 font-bold font_baloo px-4 py-4 text-center text-white group-hover:bg-green-700 transition-colors"
            >
              Subir comprobante de pago
            </button>
          </div>
            )
          : (
          <div className="relative">
            {!cargando
              ? <input
              type="button"
              value='Enviar'
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => { await handleSubirInformes() }}
              className="w-full text-2xl bg-red-600 hover:bg-red-700 transition-colors font-bold font_baloo px-4 py-4 text-center text-white"
            />
              : <input
              type="button"
              value='Enviando...'
              className="w-full text-2xl bg-red-700 transition-colors font-bold font_baloo px-4 py-4 text-center text-white"
            />
            }
          </div>
            )}
      </DialogContent>
    </Dialog>
  )
}
