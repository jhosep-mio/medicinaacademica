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
import { Global } from '../../../helper/Global'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import Decimal from 'decimal.js'
import CryptoJS from 'crypto-js'
const encryptionKey = 'qwerasd159'

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
  const { auth } = useAuth()
  const [loadingcorreo, setLoadingPago] = useState(true)
  const [medio, setMedio] = useState('transferencia')
  const [preferenceId, setPreferenceId] = useState('')
  const [openPago, setOpenPago] = useState(false)
  const [datos, setDatos] = useState<datosValues | null>(null)
  const [tipo, setTipo] = useState('')
  const currentDomain = window.location.origin
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
  const [cuponesAplicados] = useState<string[]>([])
  useEffect(() => {
    setTipo('persona')
    initMercadoPago(Global.publicmercadopago, {
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

  const [, setCuponCodigo] = useState('')
  const handleInputChange = (e: any): any => {
    setCouponCode(e.target.value)
  }
  const [cuponAplicado, setCuponAplicado] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [cuponDescuento, setCuponDescuento] = useState(0)
  const [cuponTipo, setCuponTipo] = useState('')

  const verificarCupon = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/cuponExiste/${couponCode}`
      )
      const cupon = request.data
      if (Object.keys(cupon).length > 0) {
        const request2 = await axios.get(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${Global.url}/cursesToCompras999/${auth.id ?? ''}/${request.data.id ?? ''}`
        )
        if (request2.data && request2.data.length > 0) {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Ya utilizaste este cupón'
          })
          setCouponCode('')
          return
        }

        const cuponAplicado = cuponesAplicados.includes(cupon.codigo)
        if (cuponAplicado) {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: ' El cupón ya fue aplicado'
          })
          setCouponCode('')
          return
        }
        if (cupon.fechaInicio && cupon.fechaFinal) {
          const fechaInicio = new Date(cupon.fechaInicio)
          const fechaFinal = new Date(cupon.fechaFinal)
          const now = new Date()

          if (now < fechaInicio || now > fechaFinal) {
            // Mostrar un mensaje de error si el cupón está fuera de la fecha de validez
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              text: 'El cupón está fuera de la fecha de validez.'
            })
            return
          }
        }

        if (cupon.id_producto !== null) {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Cupón no válido, este cupón solo se puede aplicar a un producto'
          })

          return
        }
        setCuponDescuento(parseFloat(cupon.valorDescuento))
        setCuponTipo(cupon.tipoDescuento)
        // Aquí puedes agregar más validaciones según los campos del objeto cupon
        // ...
        const totalSinDescuento: number = parseFloat(String(curso?.precio2))
        const montoMinimo = parseFloat(cupon.montoMinimo)

        if (totalSinDescuento < montoMinimo) {
          // Mostrar un mensaje de error si el monto no alcanza el mínimo requerido
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: `El monto total de la orden debe ser al menos S/. ${montoMinimo}.`
          })
          return
        }
        cuponesAplicados.push(request.data.codigo)
        // Mostrar un mensaje de éxito en la interfaz del usuario
        Swal.fire({
          icon: 'success',
          title: '¡Cupón Aprobado!',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          text: `El cupón '${cupon.codigo}' existe. Se ha aplicado el descuento.`
        })
        handleClickPagar(parseFloat(cupon.valorDescuento), cupon.id)
        setCuponAplicado(request.data)
        setCuponCodigo(request.data.codigo)
        setCouponCode('')
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'El cupón no existe. Por favor, verifica el código.'
        })
      }
    } catch (error) {}
  }

  function calculateTotal (): string {
    // Obtiene el total almacenado en localStorage
    const totalSinDescuento: number = parseFloat(String(curso?.precio2))
    // Aplica el descuento del cupón al total
    let totalConDescuento =
      cuponTipo === 'porcentaje'
        ? totalSinDescuento -
          (totalSinDescuento * parseFloat(cuponDescuento.toString())) / 100
        : totalSinDescuento - parseFloat(cuponDescuento.toString())

    // Si el total con descuento es negativo, ajusta el total a 0
    totalConDescuento = Math.max(totalConDescuento, 0)
    return totalConDescuento.toString()
  }

  const handleClickPagar = async (
    pago: number,
    idpago: number
  ): Promise<void> => {
    setLoadingPago(true)
    const uniqueId = uuidv4()
    try {
      const preferenceData = {
        items: [{
          id: curso?.id,
          title: curso?.nombre,
          unit_price: parseFloat(
            new Decimal(curso?.precio2 ?? 0).minus(pago).toFixed(3)
          ),
          quantity: 1,
          picture_url: `${Global.urlImages}/productos/${curso?.imagen1 ?? ''}`
        }],
        payment_methods: {
          installments: 1,
          excluded_payment_types: [
            {
              id: 'ticket'
            },
            {
              id: 'atm'
            }
          ]
        },
        statement_descriptor: 'MEDICINA ACADÉMICA',
        payer: {
          name: datos?.nombres,
          surname: datos?.apellidos,
          email: datos?.email,
          phone: {
            area_code: '51',
            number: datos?.celular
          },
          address: {
            street_name: datos?.email,
            street_number: 123,
            zip_code: idpago ?? 'notiene'
          }
        },
        back_urls: {
          success: `${currentDomain}/success/${String(uniqueId)}`,
          failure: `${currentDomain}/error-pago`
        },
        metadata: {
          comment: uniqueId
        },
        external_reference: auth.id ? auth.id : 'notiene',
        auto_return: 'approved',
        notification_url:
          'https://academica.logosperu.com.pe/public/api/webhook'
      }

      const response = await axios.post(
        'https://api.mercadopago.com/checkout/preferences',
        preferenceData,
        {
          headers: {
            Authorization:
              `Bearer ${Global.privatemercadopago}`,
            'Content-Type': 'application/json'
          }
        }
      )
      const preferenceId: string = response.data.id
      setPreferenceId(preferenceId)
      const dataArray = []
      const dataObject = {
        id_unique: uniqueId
      }
      dataArray.push(dataObject)
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataArray),
        encryptionKey
      ).toString()
      localStorage.setItem('data', encryptedData)
    } catch (error) {
      console.error('Error al generar la preferencia de pago:', error)
    }
    setLoadingPago(false)
  }

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
        className={`w-[500px] h-[700px] ${
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

                {cuponesAplicados.length > 0
                  ? <>
                        <h6 className="text-2xl font-semibold mb-2 flex gap-6">
                          Descuento:
                          <span className="font-bold text-2xl text-black">
                            S/{' '}
                            {cuponAplicado
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                              ? cuponAplicado.valorDescuento
                              : 'asdasdasd'}
                          </span>
                        </h6>

                        <h6 className="text-2xl font-semibold mb-2 flex gap-6">
                          Total a pagar:
                          <span className="font-bold text-2xl text-black">
                            {' '}
                            S/ {calculateTotal()}
                          </span>
                        </h6>
                      </>
                  : null}
              </div>

                  <div className="my-4">
                    <label className="block text-2xl font-medium text-gray-700">
                      Código de cupón:
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="inputs_pago">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={handleInputChange}
                          placeholder="Ingresa tu cupón"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-2xl border-gray-300"
                        />
                      </div>
                      <button
                        onClick={() => {
                          verificarCupon()
                        }}
                        disabled={cuponesAplicados.length > 0}
                        className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-2xl font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Aplicar
                      </button>
                    </div>{' '}
                  </div>
                  {cuponesAplicados.length > 0 && (
                    <>
                      <label className="block text-2xl font-medium text-gray-700">
                        Cupones:
                      </label>
                      <div className="pl-2 mb-10">
                        {cuponesAplicados.map((cupon, index: number) => (
                          <span
                            className="flex font-semibold text-secondary-100 text-2xl"
                            key={index}
                          >
                            {cupon}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

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
