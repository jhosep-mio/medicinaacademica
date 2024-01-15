import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helper/Global'
import { Total } from '../shared/carrito/Total'
import { RemoveItemCart } from '../shared/carrito/RemoveItemCart'
import { BsXLg } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react'
import { PersonaNatural } from './formPago/PersonaNatural'
import { AnimatePresence, motion } from 'framer-motion'
import { FaAngleLeft } from 'react-icons/fa'
import { type datosValues } from '../shared/Interfaces'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { ModalTransferencia } from './formPago/ModalTransferencia'
import { Empresa } from './formPago/Empresa'
import mercadopago from './../../assets/cursos/iconomercadopago.png'
import iconpaypal from './../../assets/iconos/paypal.png'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import Decimal from 'decimal.js'
import CryptoJS from 'crypto-js'
import { Paypal } from './paypal/Paypal'
const encryptionKey = 'qwerasd159'

const Carrito = (): JSX.Element => {
  const { cart, setCart, auth } = useAuth()

  const LimpiarCarrito = (): void => {
    setCart([])
    localStorage.setItem('cart', '')
  }

  const [customization, setCustomization] = useState<any>(null)
  const [loadingcorreo, setLoadingCorreo] = useState(false)
  const [preferenceId, setPreferenceId] = useState('')
  const [data, setData] = useState({
    dolar: ''
  })
  const currentDomain = window.location.origin
  const getData2 = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneConfi/1`)
    setData(request.data)
  }

  useEffect(() => {
    getData2()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
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

  const [tipo, setTipo] = useState('')
  const [medio, setMedio] = useState('transferencia')
  const [openPago, setOpenPago] = useState(false)

  const handleTypePerson = (type: string): void => {
    if (type == 'persona') {
      setTipo('persona')
    } else if (type == 'empresa') {
      setTipo('empresa')
    }
  }

  const [datos, setDatos] = useState<datosValues | null>(null)

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  const [couponCode, setCouponCode] = useState('')
  const [cuponDescuento, setCuponDescuento] = useState(0)
  const [cuponTipo, setCuponTipo] = useState('')
  const handleInputChange = (e: any): any => {
    setCouponCode(e.target.value)
  }

  const [cuponesAplicados] = useState<string[]>([])

  function calculateTotalWithoutDiscount (): number {
    let total = 0
    // Calcula el total normal (sin tener en cuenta el descuento)
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      if (item.precio !== null && item.cantidad) {
        const subtotal = item.precio * item.cantidad
        total += subtotal
      }
    }
    return total
  }

  const [, setCuponCodigo] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState([])

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
        const totalSinDescuento = calculateTotalWithoutDiscount()
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

  function calculateTotalsIN (): string {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      if (item.precio !== null && item.cantidad) {
        const subtotal = item.precio * item.cantidad
        total += subtotal
      }
    }
    return total.toFixed(2) // Redondeamos a dos decimales
  }

  function calculateTotal (): string {
    // Obtiene el total almacenado en localStorage
    const totalSinDescuento: number = parseFloat(calculateTotalsIN())
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
    setLoadingCorreo(true)
    const uniqueId = uuidv4()
    const cantidadTotalProductos = cart.reduce(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      (total, producto) => total + producto?.cantidad,
      0
    )
    // Calcular la parte proporcional del descuento por producto
    const descuentoPorProducto = pago / cantidadTotalProductos
    try {
      const preferenceData = {
        items: cart.map((producto) => ({
          id: producto.id,
          title: producto.nombre,
          unit_price: parseFloat(
            new Decimal(producto.precio).minus(descuentoPorProducto).toFixed(3)
          ),
          quantity: producto.cantidad,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          picture_url: `${Global.urlImages}/productos/${producto.imagen1}`
        })),
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
    setLoadingCorreo(false)
  }

  return (
    <>
      <ModalTransferencia
        open={openPago}
        setOpen={setOpenPago}
        preferenceId={preferenceId}
        medio={medio}
        values={datos}
      />
      <section className="sect_contact pt-10 lg:pt-[58px]">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="title_contact">
                <h4>
                  <span>
                    <Link to="/">INICIO</Link>
                  </span>{' '}
                  {'//'} <span>CARRITO ({cart.length} productos)</span>
                  <br />{' '}
                  <span className="font-bold block mt-10">
                    Total: <Total />{' '}
                  </span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sect_cart">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="tbl_responsive">
                {cart.length > 0 && (
                  <button
                    type="button"
                    className="delete_items"
                    onClick={() => {
                      LimpiarCarrito()
                    }}
                  >
                    Eliminar todo
                    <BsXLg />
                  </button>
                )}
                <table className="tbl_cart lg:my-0">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody
                    style={{
                      position: 'relative',
                      minHeight: '50px',
                      height: '70px'
                    }}
                  >
                    {cart.length > 0
                      ? (
                          cart.map((producto) => (
                        <tr key={producto.id}>
                          <td>
                            <img
                              src={`${Global.urlImages}/productos/${producto.imagen1}`}
                              width="190"
                            />
                          </td>
                          <td>{producto.nombre}</td>
                          <td>S/. {producto.precio}</td>

                          <td className="drop">
                            <RemoveItemCart producto={producto} />
                          </td>
                        </tr>
                          ))
                        )
                      : (
                      <p className="text-center  absolute left-0 top-5 mt-0 right-0 mx-auto text-3xl text-[#252525]">
                        Aún no se han agregado productos al carrito ☹️
                      </p>
                        )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart_main_price flex flex-col">
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
                          disabled
                          value={
                            datos ? `${datos.nombres} ${datos.apellidos}` : ''
                          }
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
                      <span className="font-bold text-2xl text-black">
                        {cart.length}
                      </span>
                    </h6>
                    <h6 className="text-2xl font-semibold mb-2 flex gap-6">
                      {cuponesAplicados.length > 0
                        ? 'Subtotal a pagar'
                        : 'Total a pagar'}
                      :{' '}
                      <span className="font-bold text-2xl text-black">
                        {' '}
                        S/ {calculateTotalWithoutDiscount()}
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
                  <div className="flex justify-between gap-3 items-center mt-10">
                    <h2 className="text-3xl mb-2 font-bold text-[#094173]">
                      Medio de pago:
                    </h2>
                    <span className="text-2xl text-red-500 underline flex gap-0 items-center cursor-pointer"></span>
                  </div>
                  <div className="flex flex-col gap-2 py-6 pt-0 ">
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
                    <label className="radio-button w-fit cursor-pointer">
                      <input
                        type="radio"
                        name="medio"
                        value="paypal"
                        checked={medio == 'paypal'}
                        onChange={() => {
                          setMedio('paypal')
                        }}
                      />
                      <span className="radio"></span>
                      Paypal
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
                    : medio == 'paypal'
                      ? (
                        <>
                          <div className="w-full  overflow-hidden relative mt-6 group">
                            <div className="flex flex-col gap-2 w-full justify-center overflow-hidden h-full">
                              <button
                                className="relative w-full h-[45px] px-4 bg-[#009ee3] group-hover:bg-[#007eb5] transition-colors text-white text-2xl font-semibold rounded-xl flex items-center justify-center gap-3 text-center"
                              >
                                <img
                                  src={iconpaypal}
                                  alt=""
                                  className="w-[23px] h-[23px] bg-white p-1 rounded-full"
                                />
                                Pagar con paypal
                                <Paypal data={data.dolar} datos={datos} />
                              </button>
                            </div>
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
                  className={`transition-opacity ${
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
                        setLoadingCorreo={setLoadingCorreo}
                        loadingcorreo={loadingcorreo}
                        preferenceId={preferenceId}
                        setPreferenceId={setPreferenceId}
                        setDatos={setDatos}
                      />
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {tipo == 'empresa' && (
                      <Empresa
                        setLoadingCorreo={setLoadingCorreo}
                        loadingcorreo={loadingcorreo}
                        preferenceId={preferenceId}
                        setPreferenceId={setPreferenceId}
                        setDatos={setDatos}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Carrito
