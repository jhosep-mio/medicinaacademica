import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { Dialog, DialogContent, Skeleton, Stack } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { FaAngleLeft } from 'react-icons/fa'
import mercadopago from './../../../assets/cursos/iconomercadopago.png'
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { type datosValues, type productosValues } from '../Interfaces'
import { PersonaNatural } from './formPago/PersonaNatural'
import { Empresa } from './formPago/Empresa'
import { ModalTransferencia } from './formPago/ModalTransferencia'

interface valuesProps {
  curso: productosValues | null
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  loadingComponents: boolean
}

export const ModalPago = ({
  curso,
  open,
  setOpen,
  loadingComponents
}: valuesProps): JSX.Element => {
  const [loadingcorreo, setLoadingPago] = useState(true)
  const [medio, setMedio] = useState('transferencia')
  const [preferenceId, setPreferenceId] = useState('')
  const [openPago, setOpenPago] = useState(false)
  const [datos, setDatos] = useState<datosValues | null>(null)
  const [tipo, setTipo] = useState('')
  const [customization, setCustomization] = useState<any>(null)
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }
  const handleTypePerson = (type: string): void => {
    if (type == 'persona') {
      setTipo('persona')
    } else if (type == 'empresa') {
      setTipo('empresa')
    }
  }

  useEffect(() => {
    setTipo('persona')
    initMercadoPago('APP_USR-5ae65651-1986-4b17-861e-9b19389478a0', {
      locale: 'es-PE'
    })
    const walletCustomization = {
      texts: {
        action: 'pay',
        valueProp: 'security_safety'
      }
    }
    setCustomization(walletCustomization)
  }, [])

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_comentarios"
    >
      <DialogContent
        className={`w-[500px] h-[600px] ${
          tipo == 'persona' ? 'flex items-center' : ''
        } p-2`}
      >
        {!loadingComponents
          ? (
          <div className="cart_main_price flex flex-col w-full ">
            <motion.div
              className={` transition-opacity ${
                preferenceId && !loadingcorreo ? '' : 'hidden'
              }`}
              initial="hidden"
              animate="visible"
              variants={variants}
            >
              <div className="flex justify-between gap-3 items-center">
                <h2 className="text-3xl mb-2 font-bold text-[#094173]">
                  Resumen de orden
                </h2>
                <span
                  className="text-2xl text-red-500 underline flex gap-0 items-center cursor-pointer"
                  onClick={() => {
                    setPreferenceId('')
                  }}
                >
                  <FaAngleLeft className="mt-1" /> Regresar
                </span>
              </div>
              <div className="flex gap-3 w-full my-6">
                <div className="flex w-full flex-col mb-4">
                  <h6 className="text-2xl font-semibold mb-2">Nombres</h6>
                  <div className="inputs_pago ">
                    <input
                      type="text"
                      name="nombres"
                      disabled={!!datos?.nombres}
                      value={datos ? `${datos.nombres} ${datos.apellidos}` : ''}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="flex w-full  flex-col mb-4">
                  <h6 className="text-2xl font-semibold mb-2">Email</h6>
                  <div className="inputs_pago ">
                    <input
                      type="text"
                      name="nombres"
                      disabled
                      value={datos ? datos.email : ''}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
              <div className="my-10 flex flex-col gap-4">
                <h6 className="text-2xl font-semibold mb-2 flex gap-6">
                  Cantidad de productos:{' '}
                  <span className="font-bold text-2xl text-black">1</span>
                </h6>
                <h6 className="text-2xl font-semibold mb-2 flex gap-6">
                  Total a pagar:
                  <span className="font-bold text-2xl text-black">
                    {' '}
                    {curso?.precio2}
                  </span>
                </h6>
              </div>
              <div className="flex justify-between gap-3 items-center">
                <h2 className="text-3xl mb-2 font-bold text-[#094173]">
                  Medio de pago:
                </h2>
                <span className="text-2xl text-red-500 underline flex gap-0 items-center cursor-pointer"></span>
              </div>
              <div className="flex flex-col gap-2 py-6 pt-0">
                <label className="radio-button w-fit cursor-pointer">
                  <input
                    type="radio"
                    name="medio"
                    value="transferencia"
                    checked={medio == 'transferencia'}
                    onChange={() => {
                      setMedio('transferencia')
                    }}
                  />
                  <span className="radio"></span>
                  Transferencia bancaria
                </label>
                <label className="radio-button w-fit cursor-pointer">
                  <input
                    type="radio"
                    name="medio"
                    value="mercado"
                    checked={medio == 'mercado'}
                    onChange={() => {
                      setMedio('mercado')
                    }}
                  />
                  <span className="radio"></span>
                  Tarjeta de crédito o débito
                </label>
              </div>
              {medio == 'mercado'
                ? (
                <>
                  <div className="w-full h-[49px] overflow-hidden relative mt-6 group">
                    <div className="flex flex-col gap-2 w-full justify-center overflow-hidden h-full">
                      <button
                        onClick={() => {
                          setOpenPago(true)
                        }}
                        className="w-full h-full px-4 bg-[#009ee3] group-hover:bg-[#007eb5] transition-colors text-white text-2xl font-semibold rounded-xl flex items-center justify-center gap-3 text-center"
                      >
                        <img
                          src={mercadopago}
                          alt=""
                          className="w-[23px] h-[23px] "
                        />
                        Pagar con Tarjeta
                      </button>
                    </div>
                    <Wallet
                      initialization={{
                        preferenceId,
                        redirectMode: 'modal'
                      }}
                      customization={customization}
                    />
                  </div>
                  <span className="w-full block text-center text-[##737373] text-[1.2rem] mt-2">
                    {' '}
                    Paga de forma segura, Todos los paises
                  </span>
                </>
                  )
                : (
                <div className="flex flex-col gap-2 w-full mt-4 justify-center h-[84px] overflow-hidden">
                  <button
                    onClick={() => {
                      setOpenPago(true)
                    }}
                    className="w-full py-6 px-4 bg-[#009ee3] hover:bg-[#007eb5] transition-colors text-white text-2xl font-semibold rounded-xl flex items-center justify-center gap-3 text-center"
                  >
                    <FaMoneyBillTransfer className="text-white text-3xl rounded-full shadow-sm shadow-black/50 w-10 h-8 rotate-1 p-1 mt-0" />
                    Pagar con Transferencia
                  </button>
                  <span className="w-full block text-center text-[##737373] text-[1.2rem]">
                    {' '}
                    Paga de forma segura, Solo Perú
                  </span>
                </div>
                  )}
            </motion.div>
            <motion.div
              className={`overflow-y-auto transition-opacity ${
                preferenceId && !loadingcorreo ? 'hidden' : ''
              }`}
              initial="hidden"
              animate="visible"
              variants={variants}
            >
              <h2 className="text-3xl mb-2 font-bold text-[#094173]">
                Datos de contacto:
              </h2>
              <div className="flex gap-6 py-6 pt-0">
                <label className="radio-button cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="persona"
                    onChange={() => {
                      handleTypePerson('persona')
                    }}
                    defaultChecked
                  />
                  <span className="radio"></span>
                  Persona natural
                </label>
                <label className="radio-button cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="empresa"
                    onChange={() => {
                      handleTypePerson('empresa')
                    }}
                  />
                  <span className="radio"></span>
                  Empresa
                </label>
              </div>
              <AnimatePresence>
                {tipo == 'persona' && (
                  <PersonaNatural
                    setLoadingCorreo={setLoadingPago}
                    loadingcorreo={loadingComponents}
                    preferenceId={preferenceId}
                    setPreferenceId={setPreferenceId}
                    setDatos={setDatos}
                    curso={curso}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {tipo == 'empresa' && (
                  <Empresa
                    setLoadingCorreo={setLoadingPago}
                    loadingcorreo={loadingComponents}
                    preferenceId={preferenceId}
                    setPreferenceId={setPreferenceId}
                    setDatos={setDatos}
                    curso={curso}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
            )
          : (
          <Stack spacing={1} className="w-full h-full">
            <Skeleton
              animation="wave"
              variant="text"
              className="w-full h-full object-cover"
            />
          </Stack>
            )}
        <ModalTransferencia
          curso={curso}
          open={openPago}
          setOpen={setOpenPago}
          preferenceId={preferenceId}
          medio={medio}
          values={datos}
        />
      </DialogContent>
    </Dialog>
  )
}
