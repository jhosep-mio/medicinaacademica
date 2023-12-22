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

const Carrito = (): JSX.Element => {
  const { cart, setCart } = useAuth()

  const LimpiarCarrito = (): void => {
    setCart([])
    localStorage.setItem('cart', '')
  }

  const [customization, setCustomization] = useState<any>(null)
  const [loadingcorreo, setLoadingCorreo] = useState(false)
  const [preferenceId, setPreferenceId] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
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
                {cart.length > 0 &&
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
                }
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
                      Total a pagar:{' '}
                      <span className="font-bold text-2xl text-black">
                        {' '}
                        <Total />
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
                            <img src={mercadopago} alt="" className='w-[23px] h-[23px] '/>
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
